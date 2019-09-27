import React from 'react'
import InviteModal from '../modals/inviteModal'

interface State {
    inviteShow: boolean
}
interface Props {
    groupName: string
    groupDesc: string
    groupId: string
    isAdmin: boolean
    numOfMembers: number
    goToCreateQuiz(groupId: string): void
}

class GroupCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { inviteShow: false }

        this.goToCreateQuiz = this.goToCreateQuiz.bind(this)
        this.showHideInviteModal = this.showHideInviteModal.bind(this)
    }

    goToCreateQuiz(){
        this.props.goToCreateQuiz(this.props.groupId)
    }

    showHideInviteModal() {
        let { inviteShow } = this.state
        this.setState({ inviteShow: inviteShow ? false : true })
    }

    render() {
        let { groupName, groupDesc, groupId, isAdmin } = this.props
        let { inviteShow } = this.state

        let trimmedDesc = groupDesc.length > 55 ? groupDesc.slice(0,55) + "..." :groupDesc

        return (
            <div className="group-card-info" id={groupId.toString()}>
                <p className="group-name">{ groupName }</p>
                { isAdmin ?
                    <div className="admin-controls">
                        <button className="invite-user" id={groupId} onClick={this.showHideInviteModal}> Invite User </button>
                        <button className="create-quiz" onClick={this.goToCreateQuiz}> Create Quiz </button>
                    </div>
                    :
                    null
                }
                <p className="group-desc">{ trimmedDesc }</p>
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