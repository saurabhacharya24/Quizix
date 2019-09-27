import React from 'react'
// import axios from 'axios'

interface State {
    quizName: string
    quizDesc: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    reviewDate: string
}

interface Props {
    groupId: string
}

class CreateQuiz extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            quizName: "",
            quizDesc: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            reviewDate: ""
        }

        this.changeQuizNameState = this.changeQuizNameState.bind(this)
    }

    changeQuizNameState(evt: any) {
        let quizName: string = evt.currentTarget.value
        this.setState({ quizName: quizName })
    }

    renderQuizNameAndDesc() {
        return (
            <div>
                <div className="quiz-name-box">
                    <p className="quiz-name"> Quiz Name: </p>
                    <input className="quiz-name-input" onChange={this.changeQuizNameState}/>
                </div>
                <div className="quiz-desc-box">
                    <p className="quiz-desc"> Quiz Description: </p>
                    <input className="quiz-desc-input" /> 
                </div>
            </div>
        )
    }

    renderStartDatetime() {
        return (
            <div>
                <div className="start-date-box">
                    <p className="start-date"> Start Date: </p>
                    <input className="start-date-input" placeholder="DD/MM/YYYY"/>
                </div>
                <div className="start-time-box">
                    <p className="start-time"> Start Time: </p>
                    <input className="start-time-input" placeholder="HH:MM:SS"/>
                </div>
            </div>
        )
    }

    renderEndDatetime() {
        return (
            <div>
                 <div className="end-date-box">
                    <p className="end-date"> End Date: </p>
                    <input className="end-date-input" placeholder="DD/MM/YYYY"/>
                </div>
                <div className="end-time-box">
                    <p className="end-time"> End Time: </p>
                    <input className="end-time-input" placeholder="HH:MM:SS"/>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="create-quiz-main">
                {this.renderQuizNameAndDesc()}
                {this.renderStartDatetime()}
                {this.renderEndDatetime()}
            </div>
        )
    }
}

export default CreateQuiz