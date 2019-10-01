import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreateQuestionCard from '../cards/createQuestionCard';
import { IQuestion } from '../../interfaces/questions';
// import axios from 'axios'

interface State {
    quizName: string
    quizDesc: string
    startDate: Date
    endDate: Date
    reviewDate: Date
    questionComponents: Array<JSX.Element>
    questions: Array<IQuestion>
    qCardId: number
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
            questionComponents: [],
            questions: [],
            qCardId: 0
        }

        this.changeQuizNameState = this.changeQuizNameState.bind(this)
        this.changeQuizDescState = this.changeQuizDescState.bind(this)
        this.incQuestions = this.incQuestions.bind(this)
        this.decQuestions = this.decQuestions.bind(this)
        this.changeQuestionTextState = this.changeQuestionTextState.bind(this)
        this.changeAnswerTextState = this.changeAnswerTextState.bind(this)
        this.changeCorrectAnswerState = this.changeCorrectAnswerState.bind(this)
        this.incAnswers = this.incAnswers.bind(this)
        this.decAnswers = this.decAnswers.bind(this)
        this.getSelfState = this.getSelfState.bind(this)
    }

    changeQuizNameState(evt: any) { this.setState({ quizName: evt.currentTarget.value }) }
    changeQuizDescState(evt: any) { this.setState({ quizDesc: evt.currentTarget.value }) }
    changeStartDateState = (date: Date) => { this.setState({ startDate: date }) }
    changeEndDateState = (date: Date) => { this.setState({ endDate: date }) }
    changeReviewDateState = (date: Date) => { this.setState({ reviewDate: date }) }

    incQuestions() {
        let { questionComponents, questions, qCardId } = this.state
        let qId = (qCardId+1).toString()
        
        questionComponents.push(
            <CreateQuestionCard
                key={qCardId+1}
                qNum={qCardId+1}
                removeQuestion={this.decQuestions}
                changeQuestionText={this.changeQuestionTextState}
                changeAnswerText={this.changeAnswerTextState}
                changeCorrectAnswer={this.changeCorrectAnswerState}
                increaseAnswers={this.incAnswers}
                decreaseAnswers={this.decAnswers}
            />)

        let q = {
            qId: qId,
            question: "",
            answers: [],
            correctAnswer: ""
        }
        questions.push(q)

        this.setState({
            questionComponents: questionComponents,
            questions: questions,
            qCardId: qCardId+1,
        })
    }

    incAnswers(qNum: number, ansId: number) {
        let { questions } = this.state
        let qId = qNum.toString()
        let aId = ansId.toString()

        questions.forEach(q => {
            if (qId === q.qId) {
                let a = {
                    aId: aId,
                    ans: ""
                }
                q.answers.push(a)
            }
        })
    }

    decQuestions(evt: any) {
        let { questionComponents, questions } = this.state
        let qNum = evt.target.id
        let countComponents = 0
        let countQs = 0

        let arrComponents1: Array<JSX.Element> = []
        let arrComponents2: Array<JSX.Element> = []
        let arrQs1: Array<IQuestion> = []
        let arrQs2: Array<IQuestion> = []
        
        questionComponents.forEach(q => {
            if (qNum === q.key) {
                arrComponents1 = questionComponents.slice(0, countComponents)
                arrComponents2 = questionComponents.slice(countComponents+1, questionComponents.length)
            }
            else { countComponents++ }
        })

        questions.forEach(q => {
            if (qNum === q.qId) {
                arrQs1 = questions.slice(0, countQs)
                arrQs2 = questions.slice(countQs+1, questions.length)
            }
            else { countQs++ }
        })
        
        let finalComponents = arrComponents1.concat(arrComponents2)
        let finalQs = arrQs1.concat(arrQs2)

        this.setState({
            questionComponents: finalComponents,
            questions: finalQs
        })
    }

    decAnswers(qNum: number, aId: string) {
        let { questions } = this.state
        let qId = qNum.toString()

        let arr1: Array<any> = []
        let arr2: Array<any> = []
        let finalArr: Array<any> = []

        questions.forEach(q => {
            if (qId === q.qId) {
                let count = 0 
                let answers = q.answers
        
                answers.forEach(a => {
                    if (aId === a.aId) {
                        arr1 = answers.slice(0, count)
                        arr2 = answers.slice(count+1, q.answers.length)
                        finalArr = arr1.concat(arr2)
                    }
                    else { count++ }
                })

                q.answers = finalArr
            }
        })

        this.setState({ questions: questions })
    }

    changeQuestionTextState(qNum: number, qText: string) {
        let qId = qNum.toString()
        let { questions } = this.state 

        questions.forEach(q => {
            if (qId === q.qId) { q.question = qText }
        })

        this.setState({ questions: questions })
    }

    changeAnswerTextState(qNum: number, aId: string, answerText: string) {
        let qId = qNum.toString()
        let { questions } = this.state

        questions.forEach(q => {
            if (qId === q.qId) {
                q.answers.forEach(ans => {
                    if (aId === ans.aId) {
                        ans.ans = answerText
                    }
                })
            }
        })

        this.setState({ questions: questions })
    }

    changeCorrectAnswerState(qNum: number, correctAnswer: string) {
        let qId = qNum.toString()
        let { questions } = this.state
        
        questions.forEach(q => {
            if (qId === q.qId) { q.correctAnswer = correctAnswer }
        })

        this.setState({ questions: questions })
    }

    getSelfState() {
        let { questions, quizName, quizDesc, startDate, endDate, reviewDate } = this.state
        
        let availableFromDate = startDate.getFullYear()+"-"+startDate.getMonth()+"-"+startDate.getUTCDate()
        let availableFromTime = startDate.getHours()+":"+startDate.getMinutes()+":00"
        let availableToDate = endDate.getFullYear()+"-"+endDate.getMonth()+"-"+endDate.getUTCDate()
        let availableToTime = endDate.getHours()+":"+endDate.getMinutes()+":00"
        let reviewDateTime = reviewDate.getFullYear()+"-"+reviewDate.getMonth()+"-"+reviewDate.getUTCDate()+" 00:00:00"
        let { groupId } = this.props

        let quizBody = {
            quiz: [
                {
                    quiz_name: quizName,
                    quiz_desc: quizDesc,
                    group_id: groupId,
                    num_of_questions: questions.length,
                    available_from: availableFromDate+" "+availableFromTime,
                    available_to: availableToDate+" "+availableToTime,
                    is_visible: true,
                    review_date: reviewDateTime,
                }
            ]
        }

        console.log(quizBody)
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
        let { questionComponents } = this.state
        let numQs = questionComponents.length
        let numQsIndicator: string

        numQs !== 1 ? numQsIndicator = "questions" : numQsIndicator = "question"

        return (
            <div className="create-quiz-main">
                {this.renderQuizNameAndDesc()}
                {this.renderStartDatetime()}
                {this.renderEndDatetime()}
                {this.renderReviewDate()}
                <p className="questions-main-title"> Questions </p>
                <p className="num-of-questions-text"> You have {numQs} {numQsIndicator} </p>
                <button className="add-question" onClick={this.incQuestions}> + Add Question </button>
                {questionComponents.map(question => {
                    return question
                })}
                {numQs > 0 ? 
                    <button className="submit-create-quiz" onClick={this.getSelfState}> Create! </button>
                    : 
                    null
                }
            </div>
        )
    }
}

export default CreateQuiz