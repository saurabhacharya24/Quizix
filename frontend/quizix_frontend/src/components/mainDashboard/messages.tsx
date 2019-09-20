import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import { IInvites, IRequests } from '../../interfaces/messages'
import NoInfoCard from '../cards/noInfoCard'
import getUserId from '../../helpers/cookies'

interface State {
    invites: Array<IInvites>
    invitesLoaded: boolean
    requests: Array<IRequests>
    requestsLoaded: boolean
}

interface Props {}

class Messages extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            invites: [],
            invitesLoaded: false,
            requests: [],
            requestsLoaded: false
        }
    }

    async componentDidMount() {
        let userId = getUserId()

        try {
            let response = await axios.get(API_URL+"/my_invites?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ invites: data, invitesLoaded: true })
        } catch (error) {
            if (error.response.data.code === 0) {
                this.setState({ invites: [], invitesLoaded: true })
            } 
        }

        try {
            let response = await axios.get(API_URL+"/my_requests?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ requests: data, requestsLoaded: true})
        } catch (error) {
            if (error.response.data.code === 0) {
                this.setState({ requests: [], requestsLoaded: true})
            }
        }
    }

    render() {
        let { invites, invitesLoaded, requests, requestsLoaded } = this.state
        return (
            invitesLoaded || requestsLoaded ?
            <div>
                <p className="invites-text"> Invites </p>
                <div className="invites">
                    {invites.length !== 0 ?
                        invites.map((invite: IInvites) => 
                        <p> In Progress... </p>)
                    : 
                    <NoInfoCard infoMessage="No Invites Found" />
                    }
                </div>
                <p className="requests-text"> Requests </p>
                <div className="requests">
                    {requests.length !== 0 ?
                        requests.map((request: IRequests) => 
                        <p> In Progress... </p>)
                    :
                    <NoInfoCard infoMessage="No Requests Found" />
                    }
                </div>
            </div>
            :
            null
        )
    }
}

export default Messages