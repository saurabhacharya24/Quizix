import React from 'react'
import axios from 'axios'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import { IInvites, IRequests } from '../../interfaces/messages'
import NoInfoCard from '../cards/noInfoCard'
import getUserId from '../../helpers/cookies'
import InviteCard from '../cards/inviteCard'
import RequestCard from '../cards/requestCard'

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
                            <InviteCard 
                                groupName={invite.group_name}
                                groupDesc={invite.group_desc}
                                groupId={invite.group_id}
                                timestamp={invite.timestamp}
                            />)
                    : 
                        <NoInfoCard infoMessage="No Invites Found" />
                    }
                </div>
                <p className="requests-text"> Requests </p>
                <div className="requests">
                    {requests.length !== 0 ?
                        requests.map((request: IRequests) => 
                        <RequestCard
                            forGroup={request.for_group}
                            groupId={request.group_id}
                            timestamp={request.timestamp}
                            userDName={request.user_dname}
                            userEmail={request.user_email}
                        />)
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