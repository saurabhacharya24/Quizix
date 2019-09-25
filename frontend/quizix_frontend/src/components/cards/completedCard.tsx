import React from 'react'

interface Props {
    quizName: string
    groupName: string
    marks: string
    reviewDate: string
    quizId: string
}

const CompletedCard = (props: Props) => {

    let { quizName, groupName, marks, quizId, reviewDate } = props
    let trimmedQuiz = quizName.length > 25 ? quizName.slice(0,25) + "..." : quizName
    let trimmedGroupName = groupName.length > 15 ? groupName.slice(0,15) + "..." : groupName
    // console.log(reviewDate)

    return (
        <div className="completed-card-info" id={quizId}>
            <p className="completed-name">{ trimmedQuiz }</p>
            <p className="completed-group">{ trimmedGroupName }</p>
            <p className="completed-marks"> Marks: { marks } </p>
            {/* CHECK REVIEWDATE TO SEE IF IT'S AFTER CURRENT DATE/TIME */}
            {reviewDate === null ?
                <button className="review-quiz"> Review </button>
                :
                null
            }
        </div>
    )
}

export default CompletedCard