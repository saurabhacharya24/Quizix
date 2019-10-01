import React from 'react'
import { quizTimeRemaining } from '../../helpers/dateOperations'

interface Props {
    availableTo: Date
    groupName: string
    quizName: string
    quizId: string
}

const QuizCard = (props: Props) => {

    let { quizName, groupName, availableTo, quizId } = props
    let trimmedQuiz = quizName.length > 25 ? quizName.slice(0,25) + "..." : quizName
    let trimmedGroup = groupName.length > 25 ? groupName.slice(0,15) + "..." : groupName
    let timeLeft = quizTimeRemaining(availableTo)

    return (
        <div className="quiz-card-info" id={quizId}>
            <p className="quiz-name">{ trimmedQuiz }</p>
            <p className="quiz-group">{ trimmedGroup }</p>
            <p className="quiz-available-to">{ timeLeft }</p>
        </div>
    )
}

export default QuizCard