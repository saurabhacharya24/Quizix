import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreateQuestionCard from '../cards/createQuestionCard';
// import axios from 'axios'

interface State {
    quizName: string
    quizDesc: string
    startDate: Date
    endDate: Date
    reviewDate: Date
    questions: Array<JSX.Element>
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
            startDate: new Date(),
            endDate: new Date(),
            reviewDate: new Date(),
            questions: []
        }

        this.changeQuizNameState = this.changeQuizNameState.bind(this)
        this.changeQuizDescState = this.changeQuizDescState.bind(this)
        this.incQuestions = this.incQuestions.bind(this)
        this.decQuestions = this.decQuestions.bind(this)
    }

    changeQuizNameState(evt: any) { this.setState({ quizName: evt.currentTarget.value }) }
    changeQuizDescState(evt: any) { this.setState({ quizDesc: evt.currentTarget.value }) }
    changeStartDateState = (date: Date) => { this.setState({ startDate: date }) }
    changeEndDateState = (date: Date) => { this.setState({ endDate: date }) }
    changeReviewDateState = (date: Date) => { this.setState({ reviewDate: date }) }

    incQuestions() {
        let { questions } = this.state
        let qNumNow = questions.length+1
        questions.push(
            <CreateQuestionCard
                key={qNumNow}
                qNum={qNumNow}
                removeQuestion={this.decQuestions}
            />)
        this.setState({ questions: questions })
    }

    decQuestions(evt: any) {
        let { questions } = this.state
        let qNum = evt.target.id
        let count = 0;

        let arr1: Array<JSX.Element> = []
        let arr2: Array<JSX.Element> = []
        
        questions.forEach(q => {
            if (qNum === q.key) {
                arr1 = questions.slice(0,count)
                arr2 = questions.slice(count+1, questions.length)
            }
            else {
                count++
            }
        })
        
        let finalArr = arr1.concat(arr2)
        this.setState({ questions: finalArr })
    }

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
                    <p className="start-date"> Starts on: </p>
                    <DatePicker
                        selected={this.state.startDate}
                        onChange={this.changeStartDateState}
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
                    <p className="end-date"> Ends on: </p>
                    <DatePicker
                        selected={this.state.endDate}
                        onChange={this.changeEndDateState}
                        className="end-date-input"
                        minDate={this.state.startDate}
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

    renderReviewDate() {
        return (
            <div>
                <div className="review-date-box">
                    <p className="review-date"> Can be reviewed after: </p>
                    <DatePicker
                        selected={this.state.reviewDate}
                        onChange={this.changeReviewDateState}
                        className="review-date-input"
                        minDate={this.state.endDate}
                        dateFormat="dd MMMM yyyy"
                    />
                </div>
            </div>
        )
    }

    render() {
        let { questions } = this.state
        let numQs = questions.length

        return (
            <div className="create-quiz-main">
                {this.renderQuizNameAndDesc()}
                {this.renderStartDatetime()}
                {this.renderEndDatetime()}
                {this.renderReviewDate()}
                <p className="questions-main-title"> Questions </p>
                <p className="num-of-questions-text"> You have {numQs} question(s) </p>
                <button className="add-question" onClick={this.incQuestions}> + Add Question </button>
                {questions.map(question => {
                    return question
                })}
                {numQs > 0 ? 
                    <button className="submit-create-quiz"> Create! </button>
                    : 
                    null
                }
            </div>
        )
    }
}

export default CreateQuiz