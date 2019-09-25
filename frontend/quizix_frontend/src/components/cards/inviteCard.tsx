import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import getUserId from '../../helpers/cookies'

interface State {}
interface Props {
    groupName: string,
    groupDesc: string, 
    groupId: number,
    timestamp: Date
}

class InviteCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.acceptInvite = this.acceptInvite.bind(this)
        this.declineInvite = this.declineInvite.bind(this)
    }

    async acceptInvite() {
        let userId = getUserId()
        let { groupId } = this.props
        
        let body = {
            group_id: groupId
        }

        try {
            await axios.post(API_URL+"/accept_invite?user_id="+userId, body, headerConfig)
            window.location.reload()
        } catch (error) {
            alert("Couldn't accept invite, please try again later.")
        }
    }

    async declineInvite() {
        let userId = getUserId()
        let { groupId } = this.props

        try {
            await axios.delete(API_URL+"/delete_invite?group_id="+groupId+"&user_id="+userId, headerConfig)
            window.location.reload()
        } catch (error) {
            alert("Couldn't delete invite, please try again later.")
        }
    }

    render() {
        let { groupName, groupDesc, timestamp } = this.props
        let trimmedTime = timestamp.toLocaleString().slice(0, -4)
        
        return (
            <div className="invite-card-info">
                <p className="group-name"> {groupName} </p>
                <button className="decline-invite-button" onClick={this.declineInvite}> Decline </button>
                <button className="accept-invite-button" onClick={this.acceptInvite}> Accept </button>
                <p className="group-desc"> {groupDesc} </p>
                <p className="timestamp"> {trimmedTime} </p>
            </div>
        )
    }
}

export default InviteCard