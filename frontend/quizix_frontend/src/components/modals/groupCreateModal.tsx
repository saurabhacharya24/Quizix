import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import getUserId from '../../helpers/cookies'

interface State {
    createButtonText: string
    hasCreatedGroup: boolean
}
interface Props {
    showState: boolean
    // groupId: string
    toggleShowState(): void 
}

class GroupCreateModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            createButtonText: "Create Group",
            hasCreatedGroup: false
        }

        this.createGroup = this.createGroup.bind(this)
        this.toggleShowStateLocal = this.toggleShowStateLocal.bind(this)
    }

    toggleShowStateLocal() {
        this.setState({ createButtonText: "Create Group", hasCreatedGroup: false })
        this.props.toggleShowState()
    }

    async createGroup() {
        let groupName = (document.getElementById('js-group-name') as HTMLInputElement).value
        let groupDesc = (document.getElementById('js-group-desc') as HTMLInputElement).value
        let userId = getUserId()

        if ((groupName.length && groupDesc.length) > 0) {

            this.setState({ createButtonText: "Creating..." })

            let body = {
                group_name: groupName,
                group_desc: groupDesc
            }

            try {
                let response = await axios.post(API_URL+"/group_creation?user_id="+userId, body, headerConfig)
                if (response.status === 200) {
                    this.setState({ hasCreatedGroup: true, createButtonText: "Created!"})
                }
            } catch (error) {
                console.log(error)
            }
        }

        else {
            alert("Group names and descriptions can't be empty!")
        }
    }
    // sendInvite() {
    //     let createField = (document.getElementById('js-create-list') as HTMLInputElement)
    //     let emails = inviteField.value.split(",")
    //     let userId = getUserId()
    //     let numEmails = emails.length
    //     let count = 0

    //     if(inviteField.value.length !== 0) {

    //         this.setState({ inviteButtonText: "Sending..." })

    //         emails.forEach(async email => {
    //             count += 1
    //             let body = {
    //                 user_email: email.trim(),
    //                 group_id: this.props.groupId
    //             }

    //             console.log(email, count)
    //             try {
    //                 await axios.post(API_URL+"/invitation?user_id="+userId, body, headerConfig)
    //                 if (count === numEmails) this.setState({ hasSentInvites: true, inviteButtonText: "Sent!" })
    //             } catch (error) {
    //                 if (error.response.data.code === 502) {
    //                     alert("You can't invite yourself!")
    //                     this.setState({ inviteButtonText: "Send Invite", hasSentInvites: false })
    //                 }
    //                 else if (error.response.data.code === 505) {
    //                     alert("You've already invited " + email)
    //                     this.setState({ inviteButtonText: "Send Invite", hasSentInvites: false })
    //                 }
    //                 else if (count === numEmails) this.setState({ hasSentInvites: true, inviteButtonText: "Sent!" })
    //             }
    //         })
    //     }
    // }

    render() {
        let { showState } = this.props
        let { createButtonText } = this.state

        return (
            showState ?
                <div className="modal">
                    <div className="create-group-box">
                        <span className="close-modal" onClick={this.toggleShowStateLocal}> &times; </span>
                        <div className="group-name">
                            <p className="group-name-text"> Group Name: </p>
                            <input className="group-name-input" id="js-group-name" />
                        </div>
                        <div className="group-desc">
                            <p className="group-desc-text"> Group Description: </p>
                            <input className="group-desc-input" id="js-group-desc"/>
                        </div>
                        <button className="create-group-submit-button" onClick={this.createGroup}> {createButtonText} </button>
                    </div>
                </div>
            :
                null
        )
    }
}

export default GroupCreateModal