import React from 'react'
import axios from 'axios'
import { API_URL } from '../../helpers/apiConsts'
import AttemptQuestionCard from '../cards/attemptQuestionCard'

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
    }

    async componentDidMount() {
        let { quizId } = this.props

        try {
            let response = await axios.get(API_URL+"/questions?quiz_id="+quizId)
            let data = await response.data
            this.setState({ questions: data })
        } catch (error) {
            alert("Couldn't load quiz questions, please go to dashboard and try again or contact admin.")
        }
    }

    changeSelectedAnswers(qId: number, aId: string) {
        let { selectedAnswers } = this.state
        selectedAnswers[qId] = aId
        this.setState({ selectedAnswers: selectedAnswers })
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
            </div>
        )
    }
}

export default AttemptQuiz