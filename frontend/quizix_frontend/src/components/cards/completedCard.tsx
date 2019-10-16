import React from 'react'
import { reviewTimeRemaining } from '../../helpers/dateOperations'

interface State {}

interface Props {
    quizName: string
    groupName: string
    marks: string
    reviewDate: Date
    quizId: string
    goToReviewQuiz(quizId: string, marks: string): void
}

class CompletedCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.reviewQuiz = this.reviewQuiz.bind(this)
    }

    reviewQuiz(evt: any) {
        let { marks } = this.props
        let quizId = evt.target.id
        this.props.goToReviewQuiz(quizId, marks)
    }

    render() {
        let { quizName, groupName, marks, quizId, reviewDate } = this.props
        let trimmedQuiz = quizName.length > 25 ? quizName.slice(0,25) + "..." : quizName
        let trimmedGroupName = groupName.length > 25 ? groupName.slice(0,15) + "..." : groupName

        let currTime = new Date().getTime() + (10 * 60 * 60 * 1000)
        let reviewTime = new Date(reviewDate).getTime()
        let reviewTimeLeft = reviewTimeRemaining(reviewDate)
        
        
        return (
            <div className="completed-card-info">
                <p className="completed-name">{ trimmedQuiz }</p>
                <p className="completed-group">{ trimmedGroupName }</p>
                <p className="completed-marks"> Marks: { marks } </p>
                {currTime >= reviewTime ?
                    <button className="review-quiz" id={quizId} onClick={this.reviewQuiz}> Review </button>
                    :
                    <p className="review-quiz-time-left"> (You can review this quiz after {reviewTimeLeft}) </p>
                }
            </div>
        )
            }
}

export default CompletedCard