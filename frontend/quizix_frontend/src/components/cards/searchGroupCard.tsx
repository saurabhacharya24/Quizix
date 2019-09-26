import React from 'react'
import axios from 'axios'
import getUserId from '../../helpers/cookies'
import { API_URL, headerConfig } from '../../helpers/apiConsts'

interface State {
    joinButtonDisabled: boolean
    joinButtonText: string
}

interface Props {
    groupName: string,
    groupDesc: string,
    groupId: number
}

class SearchGroupCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            joinButtonDisabled: false,
            joinButtonText: "Join"
        }
        this.sendRequestToGroup = this.sendRequestToGroup.bind(this)
    }

    async sendRequestToGroup() {
        // console.log("Joined " + this.props.groupId)
        let userId = getUserId()
        let body = { group_id: this.props.groupId }

        try {
            await axios.post(API_URL+"/request_membership?user_id="+userId, body, headerConfig)
        } catch (error) {
            alert("You already requested to be added to this group!")
        }

        this.setState({
            joinButtonDisabled: true,
            joinButtonText: "Requested!"
        })
    }
    
    render() {
        let { groupName, groupDesc } = this.props
        let { joinButtonDisabled, joinButtonText } = this.state

        return (
            <div className="search-group-card">
                <p className="group-name"> {groupName} </p>
                <button className="join-group-button" onClick={this.sendRequestToGroup} disabled={joinButtonDisabled}> {joinButtonText} </button> 
                <p className="group-desc"> {groupDesc} </p>
            </div>
        )
    }
}

export default SearchGroupCard