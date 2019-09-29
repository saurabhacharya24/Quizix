import React from 'react'

interface State {
    questionText: string
    choices: Array<JSX.Element>
    numChoices: number
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
            choices: [],
            numChoices: 0
        }

        this.increaseChoices = this.increaseChoices.bind(this)
        this.decreaseChoices = this.decreaseChoices.bind(this)
    }

    componentDidMount() {
        this.increaseChoices()
        // this.increaseChoices()
    }

    changeQuestionTextState = (evt: any) => {
        let question: string = evt.target.value
        this.setState({ questionText: question })
    }
    
    increaseChoices() {
        let { choices, numChoices } = this.state
        choices.push(this.renderChoice(numChoices+1))

        this.setState({
            choices: choices,
            numChoices: numChoices+1
        })
    }

    decreaseChoices(evt: any) {
        let { choices, numChoices } = this.state
        let choiceNum = evt.target.id
        let count = 0;

        let arr1: Array<JSX.Element> = []
        let arr2: Array<JSX.Element> = []
        
        choices.forEach(c => {
            if (choiceNum === c.key) {
                arr1 = choices.slice(0,count)
                arr2 = choices.slice(count+1, choices.length)
            }
            else {
                count++
            }
        })
        
        let finalArr = arr1.concat(arr2)
        this.setState({
            choices: finalArr,
            numChoices: numChoices-1
        })
    }

    renderChoice(choiceNum: number): JSX.Element {
        return (
            <div className="choice" key={choiceNum}>
                <span className="remove-choice" onClick={this.decreaseChoices} id={choiceNum.toString()}> &times; </span>
                <input className="choice-input" id={"choice"+choiceNum.toString()} placeholder="Enter choice..." />
            </div>
        )
    }

    render() {
        let { qNum, removeQuestion } = this.props
        let { choices } = this.state

        return (
            <div className="question-box">
                <span className="remove-question" onClick={removeQuestion} id={qNum.toString()}> &times; </span> 
                <p className="question-text"> Question: </p>
                <textarea className="question" placeholder="Enter question..." onChange={this.changeQuestionTextState}/>
                <p className="choices-text"> Choices (minimum 2): </p>
                <div className="choices-box">
                    {choices.map(choice => {
                        return choice
                    })}
                </div>
                <button className="increase-choices" onClick={this.increaseChoices}> Add Choice </button>
            </div>
        )
    }
}

export default CreateQuestionCard