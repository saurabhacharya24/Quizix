import React from 'react'
import axios from 'axios'
import GroupCard from '../cards/groupCard'
// import InviteModal from './inviteModal'
import { IGroups, ISearchGroups } from '../../interfaces/groups'
import getUserId from '../../helpers/cookies'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import GroupCreateModal from '../modals/groupCreateModal'


interface State {
    groups: Array<IGroups>
    searchGroups: Array<ISearchGroups>
    groupsLoaded: boolean
    createGroupModalShow: boolean
}

interface Props {}

class Groups extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            groups: [],
            searchGroups: [],
            groupsLoaded: false,
            createGroupModalShow: false
        }

        this.toggleCreateGroupModalState = this.toggleCreateGroupModalState.bind(this)
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

        try {
            let response = await axios.get(API_URL+"/search_groups?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ searchGroups: data})
        } catch (error) {
            this.setState({ searchGroups: [] })
        }
    }

    toggleCreateGroupModalState() {
        let showHide = this.state.createGroupModalShow
        this.setState({ createGroupModalShow: showHide ? false : true })
    }

    render() {
        let { groups, groupsLoaded, createGroupModalShow } = this.state

        return (
            groupsLoaded ?
            <div>
                <p className="groups-text"> My Groups </p>
                <button className="create-group-button" onClick={this.toggleCreateGroupModalState}> Create Group </button>
                <div className="groups">
                    {groups.map((group: IGroups) => 
                        <GroupCard
                            groupName={group.group_name}
                            groupDesc={group.group_desc}
                            groupId={group.group_id}
                            isAdmin={group.is_admin}
                            numOfMembers={group.num_of_members}
                        />
                    )}
                    <GroupCreateModal 
                        showState={createGroupModalShow}
                        toggleShowState={this.toggleCreateGroupModalState}
                        />
                </div>
                <button className="search-groups-init-button"> Search for Groups! </button>
            </div>
            :
            null
        )
    }
}

export default Groups