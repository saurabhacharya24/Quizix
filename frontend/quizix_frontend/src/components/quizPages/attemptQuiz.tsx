import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import AttemptQuestionCard from '../cards/attemptQuestionCard'
import getUserId from '../../helpers/cookies'

interface State {
    questions: Array<any>
    selectedAnswers: Array<any>
}

interface Props {
    quizId: string
} 

class AttemptQuiz extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            questions: [],
            selectedAnswers: []
        }

        this.changeSelectedAnswers = this.changeSelectedAnswers.bind(this)
        this.submitQuiz = this.submitQuiz.bind(this)
    }

    async componentDidMount() {
        let { quizId } = this.props
        let { selectedAnswers } = this.state

        try {
            let response = await axios.get(API_URL+"/questions?quiz_id="+quizId)
            let qs = await response.data
            this.setState({ questions: qs })

            qs.forEach((q: any) => {
                selectedAnswers.push("a0")
            })

            this.setState({ selectedAnswers: selectedAnswers })
        } catch (error) {
            alert("Couldn't load quiz questions, please go to dashboard and try again or contact admin.")
        }
    }

    changeSelectedAnswers(qId: number, aId: string) {
        let { selectedAnswers } = this.state
        selectedAnswers[qId] = aId
        this.setState({ selectedAnswers: selectedAnswers })
    }

    async submitQuiz() {
        let userId = getUserId()
        let { quizId } = this.props
        let { selectedAnswers } = this.state
        let allAnswered: boolean = true
        let ansCount = 1
        let errorString = ""

        let userAnswersArray: any = []

        selectedAnswers.forEach((a: any) => {
            if (a === "a0") {
                errorString += `Question ${ansCount}, `
                allAnswered = false
            }
            ansCount++
        })

        if (!allAnswered) {
            if (window.confirm(`You haven't answered ${errorString}are you sure you want to submit anyway?`)) {

                selectedAnswers.forEach((a: any) => {
                    userAnswersArray.push(
                        { "answer": a } 
                    )
                })
        
                let body = {
                    "quiz_id": quizId,
                    "review_date": null,
                    user_answers: userAnswersArray
                }
        
                try {
                    await axios.post(API_URL+"/submit_quiz?user_id="+userId, body, headerConfig)
                    window.location.reload()
                } catch (error) {
                    alert(error.response.data)
                }
            }
        }

        else {
            selectedAnswers.forEach((a: any) => {
                userAnswersArray.push(
                    { "answer": a } 
                )
            })

            let body = {
                "quiz_id": quizId,
                "review_date": null,
                user_answers: userAnswersArray
            }

            try {
                await axios.post(API_URL+"/submit_quiz?user_id="+userId, body, headerConfig)
                window.location.reload()
            } catch (error) {
                alert(error.response.data)
            }
        }
    }

    render() {
        let { questions, selectedAnswers } = this.state
        let qCount = 0

        return (
            <div className="attempt-quiz-main">
                {questions.map((q: any) => {
                    let selAns = selectedAnswers[qCount]
                    return (
                        <AttemptQuestionCard
                            question={q}
                            qCount={qCount++}
                            selAns={selAns}
                            changeSelectedAnswers={this.changeSelectedAnswers}
                        />
                    )
                })}
                <button className="submit-quiz" onClick={this.submitQuiz}> Submit </button>
            </div>
        )
    }
}

export default AttemptQuiz