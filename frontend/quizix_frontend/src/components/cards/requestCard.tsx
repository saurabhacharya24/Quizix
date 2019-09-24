import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../../helpers/apiConsts'

interface State {}
interface Props {
    forGroup: string
    groupId: number
    timestamp: Date
    userDName: string
    userEmail: string
}

class RequestCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.acceptInvite = this.acceptInvite.bind(this)
        this.declineInvite = this.declineInvite.bind(this)
    }

    async acceptInvite() {
        let { userEmail, groupId } = this.props
        let body = {
            user_email: userEmail,
            group_id: groupId
        }

        try {
            axios.post(API_URL+"/accept_request", body, headerConfig)
            window.location.reload()
        } catch (error) {
            alert("Couldn't accept request, please try again later.")
        }
    }

    async declineInvite() {
        let { userEmail, groupId } = this.props

        try {
            axios.delete(API_URL+"/delete_request?email="
                                +userEmail+"&group_id="+groupId, headerConfig)
            window.location.reload()
        } catch (error) {
            alert("Couldn't delete request, please try again later.")
        }
    }

    render() {
        let { forGroup, timestamp, userDName, userEmail } = this.props
        let trimmedTime = timestamp.toLocaleString().slice(0, -4)

        return (
            <div className="request-card-info">
                <p className="requester-info"> "{userDName}" ({userEmail}) wants to join "{forGroup}" </p>
                <button className="decline-request-button" onClick={this.declineInvite}> Decline </button>
                <button className="accept-request-button" onClick={this.acceptInvite}> Accept </button>
                <p className="timestamp"> {trimmedTime} </p>
            </div>
        )
    }
}

export default RequestCard