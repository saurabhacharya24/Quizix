import React from 'react'
import axios from 'axios'
import getUserId from '../../helpers/cookies'
import { API_URL } from '../../helpers/apiConsts'

interface State {}

interface Props {
    quizName: string
    groupName: string
    marks: string
    reviewDate: Date
    quizId: string
    goToReviewQuiz(quizId: string): void
}

class CompletedCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.reviewQuiz = this.reviewQuiz.bind(this)
    }

    async reviewQuiz(evt: any) {
        let quizId = evt.target.id
        let userId = getUserId()
        this.props.goToReviewQuiz(quizId)

        try {
            let response = await axios.get(API_URL+"/review_quiz?user_id="+userId+"&quiz_id="+quizId)
            let quizBody = await response.data
            console.log(quizBody)
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        let { quizName, groupName, marks, quizId, reviewDate } = this.props
        let trimmedQuiz = quizName.length > 25 ? quizName.slice(0,25) + "..." : quizName
        let trimmedGroupName = groupName.length > 25 ? groupName.slice(0,15) + "..." : groupName

        let currTime = new Date().getTime() + (10 * 60 * 60 * 1000)
        let reviewTime = new Date(reviewDate).getTime()
        
        
        return (
            <div className="completed-card-info">
                <p className="completed-name">{ trimmedQuiz }</p>
                <p className="completed-group">{ trimmedGroupName }</p>
                <p className="completed-marks"> Marks: { marks } </p>
                {/* Would MARKS also be shown after review date?*/}
                {/* CHECK REVIEWDATE TO SEE IF IT'S AFTER CURRENT DATE/TIME */}
                {currTime >= reviewTime ?
                    <button className="review-quiz" id={quizId} onClick={this.reviewQuiz}> Review </button>
                    :
                    null
                }
            </div>
        )
            }
}

export default CompletedCard