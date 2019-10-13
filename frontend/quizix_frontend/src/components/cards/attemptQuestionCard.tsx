import React from 'react'

interface State { }

interface Props {
    question: any
    qCount: number
    selAns: string
    changeSelectedAnswers(qId: number, aId: string): void
}

class AttemptQuestionCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.changeSelectedAnswers = this.changeSelectedAnswers.bind(this)
    }

    changeSelectedAnswers(evt: any) {
        let selectedAnsId = evt.target.id
        let qId = parseInt(selectedAnsId.split(":")[0])
        let aId = selectedAnsId.split(":")[1]
        
        this.props.changeSelectedAnswers(qId, aId)
    }

    render() {
        let { question, qCount, selAns } = this.props
        let answersObject = question.answers_list
        let answers = Object.values(answersObject)
        let aCount = 0

        return (
            <div className="question-card" id={qCount.toString()}>
                <p className="question"> {question.question} </p>
                <div className="answers-list">
                    {answers.map((a: any) => {
                        aCount++
                        if (selAns === "a"+(aCount).toString()) {
                            return (
                                <p className="answer-selected" id={`${qCount.toString()}:a${aCount.toString()}`}
                                    onClick={this.changeSelectedAnswers}>
                                    {a}
                                </p>
                            )
                        }
                        else {
                            return (
                                <p className="answer" id={`${qCount.toString()}:a${aCount.toString()}`}
                                    onClick={this.changeSelectedAnswers}>
                                    {a}
                                </p>
                            )
                        }
                    })}
                </div>
            </div>
        )
    }
}

export default AttemptQuestionCard