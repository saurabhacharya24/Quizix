import React from 'react'

interface State {}
interface Props {
    groupName: string
    groupDesc: string
    groupId: number
    isAdmin: boolean
    numOfMembers: number
}

class GroupCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    render() {
        let { groupName, groupDesc, groupId, isAdmin, numOfMembers } = this.props

        groupDesc.length > 55 ? groupDesc = groupDesc.slice(0,55) + "..." : groupDesc = groupDesc

        return (
            <div className="group-card-info" id={groupId.toString()}>
                <p className="group-name">{ groupName }</p>
                { isAdmin ?
                    <div className="admin-controls">
                        <button className="invite-user"> + Invite User </button>
                        <button className="create-quiz"> + Create Quiz </button>
                    </div>
                    :
                    null
                }
                <p className="group-desc">{ groupDesc }</p>
                {/* <p className="quiz-available-to">{ timeLeft }</p> */}
            </div>
        )
    }
}

export default GroupCard