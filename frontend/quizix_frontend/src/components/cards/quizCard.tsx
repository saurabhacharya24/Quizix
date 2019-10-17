import React from 'react'
import { quizTimeRemaining } from '../../helpers/dateOperations'

interface State {
}

interface Props {
    availableTo: Date
    groupName: string
    quizName: string
    quizId: string
    toggleAttemptQuizModal(quizName: string): void
}

class QuizCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { attemptQuizModalState: false }
        this.toggleAttemptQuizModalState = this.toggleAttemptQuizModalState.bind(this)
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
    toggleAttemptQuizModalState(){
        this.props.toggleAttemptQuizModal(this.props.quizName)
    }

    render() {
        let { quizName, groupName, availableTo, quizId } = this.props
        let trimmedQuiz = quizName.length > 25 ? quizName.slice(0,25) + "..." : quizName
        let trimmedGroup = groupName.length > 25 ? groupName.slice(0,15) + "..." : groupName
        let timeLeft = quizTimeRemaining(availableTo) + " left"

        let quizClassName = "quiz-card-info"
        if (timeLeft.includes("mins")) {
            quizClassName = "quiz-card-info--urgent"
            timeLeft += "!"
        } 

        return (
            <div className={quizClassName} id={quizId} onClick={this.toggleAttemptQuizModalState}>
                <p className="quiz-name">{ trimmedQuiz }</p>
                <p className="quiz-group">{ trimmedGroup }</p>
                <p className="quiz-available-to">{ timeLeft }</p>
            </div>
        )
    }
}

export default QuizCard