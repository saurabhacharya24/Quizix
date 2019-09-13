import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../helpers/apiConsts'
import getUserId from '../helpers/cookies'

interface State {
    inviteButtonText: string
    hasSentInvites: boolean
}
interface Props {
    showState: boolean
    groupId: string
    toggleShowState(): void 
}

class InviteModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            inviteButtonText: "Send Invite",
            hasSentInvites: false
        }

        this.sendInvite = this.sendInvite.bind(this)
        this.toggleShowStateLocal = this.toggleShowStateLocal.bind(this)
    }

    toggleShowStateLocal() {
        this.setState({ inviteButtonText: "Send Invite", hasSentInvites: false })
        this.props.toggleShowState()
    }

    sendInvite() {
        let inviteField = (document.getElementById('js-invite-list') as HTMLInputElement)
        let emails = inviteField.value.split(",")
        let userId = getUserId()
        let numEmails = emails.length
        let count = 0

        if(inviteField.value.length !== 0) {

            this.setState({ inviteButtonText: "Sending..." })

            emails.forEach(async email => {
                count += 1
                let body = {
                    user_email: email.trim(),
                    group_id: this.props.groupId
                }

                console.log(email, count)
                try {
                    await axios.post(API_URL+"/invitation?user_id="+userId, body, headerConfig)
                    if (count === numEmails) this.setState({ hasSentInvites: true, inviteButtonText: "Sent!" })
                } catch (error) {
                    if (error.response.data.code === 502) {
                        alert("You can't invite yourself!")
                        this.setState({ inviteButtonText: "Send Invite", hasSentInvites: false })
                    }
                    else if (error.response.data.code === 505) {
                        alert("You've already invited " + email)
                        this.setState({ inviteButtonText: "Send Invite", hasSentInvites: false })
                    }
                    else if (count === numEmails) this.setState({ hasSentInvites: true, inviteButtonText: "Sent!" })
                }
            })
        }
    }

    render() {
        let { showState } = this.props
        let { inviteButtonText } = this.state

        return (
            showState ?
                <div className="modal">
                    <div className="invite-user-box">
                        <span className="close-modal" onClick={this.toggleShowStateLocal}> &times; </span>
                        <div className="invite-desc">
                            <p className="invite-text"> Enter email addresses of people you want to invite </p>
                            <p className="invite-text--lower"> (To add more than 1 person, separate each email address with a comma): </p>
                        </div>
                        <input className="invite-user-input" id="js-invite-list"/>
                        <button className="invite-submit-button" onClick={this.sendInvite}> {inviteButtonText} </button>
                    </div>
                </div>
            :
                null
        )
    }
}

export default InviteModal