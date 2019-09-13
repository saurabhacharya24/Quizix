import React from 'react'
import axios from 'axios'
import GroupCard from './groupCard'
import InviteModal from './inviteModal'
import { IGroups } from '../interfaces/groups'
import getUserId from '../helpers/cookies'
import { API_URL, headerConfig } from '../helpers/apiConsts'


interface State {
    groups: Array<IGroups>
    groupsLoaded: boolean
    inviteModalShow: boolean
}

interface Props {}

class Groups extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            groups: [],
            groupsLoaded: false,
            inviteModalShow: false
        }
    }

    async componentDidMount() {
        let userId = getUserId()

        try {
            let response = await axios.get(API_URL+"/groups?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ groups: data, groupsLoaded: true })
        } catch (error) {
            this.setState({ groups: [], groupsLoaded: true })
        }
    }

    toggleInviteModalState() {
        let ims = this.state.inviteModalShow
        this.setState({ inviteModalShow: ims ? false : true })
    }

    render() {
        let { groups, groupsLoaded, inviteModalShow } = this.state

        return (
            groupsLoaded ?
            <div>
                <p className="groups-text"> My Groups </p>
                <div className="groups">
                    {groups.map((group: IGroups) => 
                        <GroupCard
                            groupName={group.group_name}
                            groupDesc={group.group_desc}
                            groupId={group.group_id}
                            isAdmin={group.is_admin}
                            numOfMembers={group.num_of_members}
                        />)}
                        {/* <InviteModal showState={inviteModalShow} /> */}
                </div>
            </div>
            :
            null
        )
    }
}

export default Groups