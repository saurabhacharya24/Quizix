import React from 'react'

interface State {
    questionText: string
    answers: Array<JSX.Element>
    numAnswers: number
}

interface Props {
    qNum: number
    removeQuestion(evt: any): void
}

class CreateQuestionCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            questionText: "",
            answers: [],
            numAnswers: 0
        }

        this.increaseAnswers = this.increaseAnswers.bind(this)
        this.decreaseAnswers = this.decreaseAnswers.bind(this)
    }

    componentDidMount() {
        this.increaseAnswers()
    }

    changeQuestionTextState = (evt: any) => {
        let question: string = evt.target.value
        this.setState({ questionText: question })
    }
    
    increaseAnswers() {
        let { answers, numAnswers } = this.state
        answers.push(this.renderAnswer(numAnswers+1))

        this.setState({
            answers: answers,
            numAnswers: numAnswers+1
        })
    }

    decreaseAnswers(evt: any) {
        let { answers, numAnswers } = this.state
        let answerNum = evt.target.id
        let count = 0;

        let arr1: Array<JSX.Element> = []
        let arr2: Array<JSX.Element> = []
        
        answers.forEach(c => {
            if (answerNum === c.key) {
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
            numAnswers: numAnswers-1
        })
    }

    renderAnswer(answerNum: number): JSX.Element {
        return (
            <div className="answer" key={answerNum}>
                <span className="remove-answer" onClick={this.decreaseAnswers} id={answerNum.toString()}> &times; </span>
                <input className="answer-input" id={"answer"+answerNum.toString()} placeholder="Enter answer..." />
            </div>
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
                <div className="answer-box">
                    {answers.map(answer => {
                        return answer
                    })}
                </div>
                <button className="increase-answer" onClick={this.increaseAnswers}> Add Answer </button>
            </div>
        )
    }
}

export default CreateQuestionCard