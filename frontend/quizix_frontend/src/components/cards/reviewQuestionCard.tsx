import React from 'react'

interface State {}

interface Props {
    question: any
    userAnswer: string
    correctAnswer: string
}

class ReviewQuestionCard extends React.Component<Props, State> {

    // constructor(props: Props) {
    //     super(props)
    // }

    render() {
        let { question, userAnswer, correctAnswer } = this.props
        let answersObject = question.answers
        let answers = Object.values(answersObject)
        let currAnsCount = 1
        // console.log(answers)

        return (
            <div className="question-card">
                {userAnswer === "a0" ?
                    <p className="if-not-attempted"> This question was not attempted! </p>
                    :
                    null
                }
                <p className="question"> {question.ques} </p>
                <div className="answers-list">
                    {answers.map((ans: any) => {
                        let currAns = "a"+currAnsCount
                        if (currAns === correctAnswer) {
                            currAnsCount++
                            return <p className="answer-correct"> {ans} </p>
                        }
                        else if (currAns === userAnswer) {
                            currAnsCount++
                            return <p className="answer-incorrect"> {ans} </p>
                        }
                        else {
                            currAnsCount++
                            return <p className="answer"> {ans} </p>
                        }
                    })}
                </div>
            </div>
        )
    }
}

export default ReviewQuestionCard