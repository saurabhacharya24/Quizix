import React from 'react'
import axios from 'axios'
import GroupCard from '../cards/groupCard'
// import InviteModal from './inviteModal'
import { IGroups, ISearchGroups } from '../../interfaces/groups'
import getUserId from '../../helpers/cookies'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import GroupCreateModal from '../modals/groupCreateModal'
import SearchGroupsModal from '../modals/searchGroupModal'
import NoInfoCard from '../cards/noInfoCard'


interface State {
    groups: Array<IGroups>
    searchGroups: Array<ISearchGroups>
    groupsLoaded: boolean
    createGroupModalShow: boolean
    searchGroupModalShow: boolean
}

interface Props {
    goToCreateQuiz(groupId: string): void
}

class Groups extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            groups: [],
            searchGroups: [],
            groupsLoaded: false,
            createGroupModalShow: false,
            searchGroupModalShow: false
        }

        this.goToCreateQuiz = this.goToCreateQuiz.bind(this)
        this.toggleCreateGroupModalState = this.toggleCreateGroupModalState.bind(this)
        this.toggleSearchGroupsModalState = this.toggleSearchGroupsModalState.bind(this)
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

        this.getSearchGroups()
    }

    async getSearchGroups() {
        let userId = getUserId()

        try {
            let response = await axios.get(API_URL+"/search_groups?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ searchGroups: data})
        } catch (error) {
            this.setState({ searchGroups: [] })
        }
    }

    goToCreateQuiz(groupId: string) {
        this.props.goToCreateQuiz(groupId)
    }

    toggleCreateGroupModalState() {
        let showHide = this.state.createGroupModalShow
        this.setState({ createGroupModalShow: showHide ? false : true })
    }

    toggleSearchGroupsModalState() {
        this.getSearchGroups()
        let showHide = this.state.searchGroupModalShow
        this.setState({ searchGroupModalShow: showHide ? false : true })
    }

    render() {
        let { groups, searchGroups, groupsLoaded, createGroupModalShow, searchGroupModalShow } = this.state

        return (
            groupsLoaded ?
            <div>
                <p className="groups-text"> My Groups </p>
                <button className="create-group-button" onClick={this.toggleCreateGroupModalState}> Create Group </button>
                <div className="groups">
                    {groups.length !== 0 ?
                        groups.map((group: IGroups) => 
                            <GroupCard
                                groupName={group.group_name}
                                groupDesc={group.group_desc}
                                groupId={group.group_id}
                                isAdmin={group.is_admin}
                                numOfMembers={group.num_of_members}
                                goToCreateQuiz={this.goToCreateQuiz}
                                key={group.group_id}
                            />
                        )
                        :
                            <NoInfoCard infoMessage="You don't have any groups right now" />
                        }
                        <GroupCreateModal 
                        showState={createGroupModalShow}
                        toggleShowState={this.toggleCreateGroupModalState}
                        />
                </div>
                <button className="search-groups-init-button" onClick={this.toggleSearchGroupsModalState}> Search for Groups! </button>
                <SearchGroupsModal 
                    showState={searchGroupModalShow}
                    searchGroups={searchGroups}
                    toggleShowState={this.toggleSearchGroupsModalState}
                />
            </div>
            :
            null
        )
    }
}

export default Groups