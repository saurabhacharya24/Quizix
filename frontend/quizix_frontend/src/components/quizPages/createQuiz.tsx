import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios'

interface State {
    quizName: string
    quizDesc: string
    startDateTime: Date
    endDateTime: Date
    reviewDate: Date
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
            startDateTime: new Date(),
            endDateTime: new Date(),
            reviewDate: new Date()
        }

        this.changeQuizNameState = this.changeQuizNameState.bind(this)
        this.changeQuizDescState = this.changeQuizDescState.bind(this)
    }

    changeQuizNameState(evt: any) { this.setState({ quizName: evt.currentTarget.value }) }
    changeQuizDescState(evt: any) { this.setState({ quizDesc: evt.currentTarget.value }) }
    changeStartDateTimeState = (date: Date) => { this.setState({ startDateTime: date }) }
    changeEndDateTimeState = (date: Date) => { this.setState({ endDateTime: date }) }
    changeReviewDateState = (date: Date) => { this.setState({ reviewDate: date }) }

    renderQuizNameAndDesc() {
        return (
            <div>
                <div className="quiz-name-box">
                    <p className="quiz-name"> Quiz Name: </p>
                    <input className="quiz-name-input" onChange={this.changeQuizNameState} />
                </div>
                <div className="quiz-desc-box">
                    <p className="quiz-desc"> Quiz Description: </p>
                    <input className="quiz-desc-input" onChange={this.changeQuizDescState} /> 
                </div>
            </div>
        )
    }

    renderStartDatetime() {
        return (
            <div>
                <div className="start-date-box">
                    <p className="start-date"> Start Date and Time: </p>
                    <DatePicker
                        selected={this.state.startDateTime}
                        onChange={this.changeStartDateTimeState}
                        className="start-date-input"
                        minDate={new Date()}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="dd MMMM yyyy, h:mm aa"   
                    />
                </div>
            </div>
        )
    }

    renderEndDatetime() {
        return (
            <div>
                 <div className="end-date-box">
                    <p className="end-date"> End Date and Time: </p>
                    <DatePicker
                        selected={this.state.endDateTime}
                        onChange={this.changeEndDateTimeState}
                        className="end-date-input"
                        minDate={new Date()}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="dd MMMM yyyy, h:mm aa"
                    />
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