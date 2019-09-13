import React from 'react'
import InviteModal from './inviteModal'

interface State {
    inviteShow: boolean
}
interface Props {
    groupName: string
    groupDesc: string
    groupId: string
    isAdmin: boolean
    numOfMembers: number
}

class GroupCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { inviteShow: false }
        this.showHideInviteModal = this.showHideInviteModal.bind(this)
    }

    showHideInviteModal() {
        let { inviteShow } = this.state
        this.setState({ inviteShow: inviteShow ? false : true })
    }

    render() {
        let { groupName, groupDesc, groupId, isAdmin, numOfMembers } = this.props
        let { inviteShow } = this.state

        groupDesc.length > 55 ? groupDesc = groupDesc.slice(0,55) + "..." : groupDesc = groupDesc

        return (
            <div className="group-card-info" id={groupId.toString()}>
                <p className="group-name">{ groupName }</p>
                { isAdmin ?
                    <div className="admin-controls">
                        <button className="invite-user" id={groupId} onClick={this.showHideInviteModal}> + Invite User </button>
                        <button className="create-quiz"> + Create Quiz </button>
                    </div>
                    :
                    null
                }
                <p className="group-desc">{ groupDesc }</p>
                <InviteModal
                    showState={inviteShow} 
                    groupId={groupId}
                    toggleShowState={this.showHideInviteModal}    
                />
            </div>
        )
    }
}

export default GroupCard