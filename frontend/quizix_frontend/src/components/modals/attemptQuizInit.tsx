import React from 'react'
import axios from 'axios'
import { API_URL } from '../../helpers/apiConsts'

interface State {
    numOfQuestions: number    
}

interface Props {
    quizName: string
    quizDesc: string
    quizId: string
    availableTo: Date
    showState: string
    toggleShowState(quizName: string): void
}

class AttemptQuizModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { numOfQuestions: 0 }
        this.toggleShowStateLocal = this.toggleShowStateLocal.bind(this)
        this.closeAttemptQuizModal = this.closeAttemptQuizModal.bind(this)
    }

    async componentDidMount() {
        let { quizId } = this.props

        try {
            let response = await axios.get(API_URL+"/quiz?quiz_id="+quizId)
            let quiz = await response.data
            this.setState({ numOfQuestions: quiz[0].num_of_questions })
        } catch (error) {
            console.log(error)
        }
    }
    
    toggleShowStateLocal(){
        this.props.toggleShowState(this.props.quizName)
    }

    closeAttemptQuizModal(){
        this.props.toggleShowState("")
    }

    render() {
        let { quizName, quizDesc, quizId, availableTo, showState } = this.props 
        let { numOfQuestions } = this.state

        let trimmedAvailable = availableTo.toString().slice(0, availableTo.toString().length-4)

        return (
            showState === quizName ?
                <div className="modal">
                    <div className="attempt-quiz-box">
                        <span className="close-modal" onClick={this.closeAttemptQuizModal}> &times; </span>
                        <div className="quiz-info">
                            <p className="quiz-name"> {quizName} </p>
                            <p className="quiz-desc"> {quizDesc} </p>
                            <p className="num-of-questions"> Number of questions: <p> {numOfQuestions} </p></p>
                            <p className="available-to"> Available Till: <p> {trimmedAvailable} </p></p>
                            <button className="start-quiz" id={quizId}> Start! </button>
                        </div>
                    </div>
                </div>
            : 
                null
        )
    }
}

export default AttemptQuizModal