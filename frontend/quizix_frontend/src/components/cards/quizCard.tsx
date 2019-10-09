import React from 'react'
import axios from 'axios'
import { quizTimeRemaining } from '../../helpers/dateOperations'
import { API_URL } from '../../helpers/apiConsts'

interface State {}

interface Props {
    availableTo: Date
    groupName: string
    quizName: string
    quizId: string
}

class QuizCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        // this.goToQuiz = this.goToQuiz.bind(this)
    }

    // async goToQuiz() {
    //     let { quizId } = this.props
        
    //     try {
    //         let response = await axios.get(API_URL+"/quiz?quiz_id="+quizId)
    //         let quiz = await response.data
    //         console.log(quiz)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    render() {
        let { quizName, groupName, availableTo, quizId } = this.props
        let trimmedQuiz = quizName.length > 25 ? quizName.slice(0,25) + "..." : quizName
        let trimmedGroup = groupName.length > 25 ? groupName.slice(0,15) + "..." : groupName
        let timeLeft = quizTimeRemaining(availableTo)

        let quizClassName = "quiz-card-info"
        if (timeLeft.includes("mins")) {
            quizClassName = "quiz-card-info--urgent"
        } 

        return (
            <div className={quizClassName} id={quizId}>
                <p className="quiz-name">{ trimmedQuiz }</p>
                <p className="quiz-group">{ trimmedGroup }</p>
                <p className="quiz-available-to">{ timeLeft }</p>
            </div>
        )
    }
}

export default QuizCard