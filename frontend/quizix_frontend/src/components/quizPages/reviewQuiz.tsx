import React from 'react'
import axios from 'axios'
import getUserId from '../../helpers/cookies'
import { API_URL } from '../../helpers/apiConsts'
import ReviewQuestionCard from '../cards/reviewQuestionCard'

interface State {
    questions: Array<any>
}

interface Props {
    quizId: string
    reviewQuizMarks: string
}

class ReviewQuiz extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            questions: [],
        }
    }

    async componentDidMount() {
        let { quizId } = this.props
        let { questions } = this.state
        let userId = getUserId()

        try {
            let response = await axios.get(API_URL+"/review_quiz?user_id="+userId+"&quiz_id="+quizId)
            let quizBody = await response.data
            let count = 0
            
            quizBody.quiz.forEach((question: any) => {
                question['user_answer'] = quizBody.user_answers[0].user_answers[count]
                questions.push(question)
                this.setState({ questions: questions })
                count++
            })
        } catch (error) {
            alert(error) // No error condition in backend?
        }
    }

    render() {
        let { quizId, reviewQuizMarks } = this.props
        let { questions } = this.state
        let quizName = quizId.split(":")[0]

        return (
            <div className="review-quiz-main">
                <p className="quiz-name"> {quizName} </p>
                <p className="quiz-marks"> Marks: {reviewQuizMarks} </p>
                <hr className="divider" />
                {questions.map((q: any) => {
                    return (
                        <div> 
                            <ReviewQuestionCard 
                                question={q}
                                userAnswer={q.user_answer}
                                correctAnswer={q.correct_answer}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ReviewQuiz