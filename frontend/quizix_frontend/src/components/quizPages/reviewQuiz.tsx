import React from 'react'

interface State {}

interface Props {
    quizId: string
}

class ReviewQuiz extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    render() {
        let { quizId } = this.props
        return (
            <div className="review-quiz-main">
                <p> Review for {quizId} </p>
            </div>
        )
    }
}

export default ReviewQuiz