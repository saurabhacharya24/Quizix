import React from 'react'

interface State {
    answers: Array<JSX.Element>
    answerId: number
    numAnswers: number
    correctAnswer: number
}

interface Props {
    qNum: number
    removeQuestion(evt: any): void
    changeQuestionText(qNum: number, qText: string): void
    changeAnswerText(qNum: number, aId: string, answerText: string): void
    changeCorrectAnswer(qNum: number, correctAnswer: string): void
    increaseAnswers(qNum: number, ansId: number): void
    decreaseAnswers(qNum: number, aId: string): void
}

class CreateQuestionCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            answers: [],
            answerId: 0,
            numAnswers: 0,
            correctAnswer: 1
        }

        this.increaseAnswers = this.increaseAnswers.bind(this)
        this.decreaseAnswers = this.decreaseAnswers.bind(this)
        this.changeCorrectAnswerState = this.changeCorrectAnswerState.bind(this)
    }

    componentDidMount() {
        let { qNum } = this.props
        this.increaseAnswers()
        // this.props.increaseAnswers(qNum)
        this.props.changeCorrectAnswer(qNum, "a1")
    }

    changeQuestionTextState = (evt: any) => {
        let question: string = evt.target.value
        let { qNum } = this.props

        this.props.changeQuestionText(qNum, question)
    }

    changeAnswerTextState = (evt: any) => {
        let { qNum } = this.props
        let ansText = evt.target.value
        let aId = evt.target.id
        this.props.changeAnswerText(qNum, aId, ansText)
    }
    
    increaseAnswers() {
        let { answers, answerId, numAnswers } = this.state
        let { qNum } = this.props

        let newNumAnswers = numAnswers+1
        answers.push(this.renderAnswer(answerId+1))

        this.setState({
            answers: answers,
            answerId: answerId+1,
            numAnswers: newNumAnswers
        })

        this.props.increaseAnswers(qNum, answerId+1)
    }

    decreaseAnswers(evt: any) {
        let { answers, numAnswers } = this.state
        let { qNum } = this.props
        let answerNum = evt.target.id
        let count = 0;

        let arr1: Array<JSX.Element> = []
        let arr2: Array<JSX.Element> = []
        
        answers.forEach(a => {
            if (answerNum === a.key) {
                arr1 = answers.slice(0,count)
                arr2 = answers.slice(count+1, answers.length)
            }
            else {
                count++
            }
        })
        
        let finalArr = arr1.concat(arr2)
        this.setState({
            answers: finalArr,
            numAnswers: numAnswers-1,
            correctAnswer: 1
        })

        this.props.changeCorrectAnswer(qNum, "a1")
        this.props.decreaseAnswers(qNum, answerNum)
    }

    changeCorrectAnswerState(evt: any) {
        let val = evt.target.value
        let { qNum } = this.props 

        this.setState({ correctAnswer: val })
        this.props.changeCorrectAnswer(qNum, "a"+val)
    }

    renderAnswer(answerNum: number): JSX.Element {
        let aId = answerNum.toString()

        return (
            <div className="answer" key={answerNum}>
                <input className="answer-input" id={aId} placeholder="Enter answer..." onChange={this.changeAnswerTextState}/>
                <span className="remove-answer" onClick={this.decreaseAnswers} id={answerNum.toString()}> &times; </span>
            </div>
        )
    }

    correctAnswersOptions() {
        let answers = []
        let { numAnswers } = this.state
        
        for (let i=1; i<=numAnswers; i++){
            answers.push(<option key={i} value={i}> {i} </option>)
        }

        return answers
    }

    renderCorrectAnswerList() {
        return (
            <select className="correct-answers-list" onChange={this.changeCorrectAnswerState}>
                {this.correctAnswersOptions()}
            </select>
        )
    }

    render() {
        let { qNum, removeQuestion } = this.props
        let { answers } = this.state

        return (
            <div className="question-box">
                <span className="remove-question" onClick={removeQuestion} id={qNum.toString()}> &times; </span> 
                <p className="question-text"> Question: </p>
                <textarea className="question" placeholder="Enter question..." onChange={this.changeQuestionTextState}/>
                <p className="answers-text"> Answers (minimum 2): </p>
                <div className="answers-box">
                    {answers.map(answer => {
                        return answer
                    })}
                </div>
                <button className="increase-answers" onClick={this.increaseAnswers}> Add Answer </button>
                <p className="correct-answers-list-text"> Correct Answer: </p>
                {this.renderCorrectAnswerList()}
            </div>
        )
    }
}

export default CreateQuestionCard