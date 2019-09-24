import React from 'react'

interface State {}
interface Props {
    quizName: string
    groupName: string
    marks: string
    reviewDate: string
    quizId: string
}

class CompletedCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    render() {
        let { quizName, groupName, marks, quizId, reviewDate } = this.props
        quizName.length > 25 ? quizName = quizName.slice(0,25) + "..." : quizName = quizName
        groupName.length > 15 ? groupName = groupName.slice(0,15) + "..." : groupName = groupName
        // console.log(reviewDate)

        return (
            <div className="completed-card-info" id={quizId}>
                <p className="completed-name">{ quizName }</p>
                <p className="completed-group">{ groupName }</p>
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
}

export default CompletedCard