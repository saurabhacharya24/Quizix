import React from 'react'
import quizTimeRemaining from '../helpers/dateCompare'

interface State {}
interface Props {
    availableTo: Date
    groupName: string
    quizName: string
}

class QuizCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    render() {
        let { quizName, groupName, availableTo } = this.props
        quizName.length > 25 ? quizName = quizName.slice(0,25) + "..." : quizName = quizName
        groupName.length > 15 ? groupName = groupName.slice(0,15) + "..." : groupName = groupName
        
        let timeLeft = quizTimeRemaining(availableTo)

        return (
            <div className="quiz-card-info">
                <p className="quiz-name">{ quizName }</p>
                <p className="quiz-group">{ groupName }</p>
                <p className="quiz-available-to">{ timeLeft }</p>
            </div>
        )
    }
}

export default QuizCard