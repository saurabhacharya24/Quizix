import React from 'react'
import { ISearchGroups } from '../../interfaces/groups'
import SearchGroupCard from '../cards/searchGroupCard'

interface State {
    filteredGroups: Array<ISearchGroups>
}
interface Props {
    showState: boolean
    searchGroups: Array<ISearchGroups>
    toggleShowState(): void
}

class SearchGroupsModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            filteredGroups: []
        }
        
        this.searchGroups = this.searchGroups.bind(this)
        this.toggleShowStateLocal = this.toggleShowStateLocal.bind(this)
    }

    searchGroups(evt: any) {
        let finalSearchResult: any = []

        let input: string = evt.target.value.toLowerCase()
        let { searchGroups } = this.props

        if (input.length !== 0) {
            searchGroups.forEach(group => {
                let groupName = group.group_name.toLowerCase()
                if (groupName.search(input) !== -1 && (!finalSearchResult.includes(group))) {
                    finalSearchResult.push(group)
                }
            })
        }

        else { finalSearchResult = [] }
            
        this.setState({ filteredGroups: finalSearchResult })
    }

    toggleShowStateLocal() {
        this.setState({ filteredGroups: [] })
        this.props.toggleShowState()
    }

    render() {
        let { showState } = this.props
        let { filteredGroups } = this.state

        return (
            showState ?
                <div className="modal">
                    <div className="search-groups-box">
                        <span className="close-modal" onClick={this.toggleShowStateLocal}> &times; </span>
                        <p className="search-info"> Search for groups by name, and they'll be shown below. </p>
                        <input className="search-groups-input" onChange={this.searchGroups}/>
                    </div>
                    <div className="search-groups-result">
                        {filteredGroups.map((group: ISearchGroups) => 
                            <SearchGroupCard
                                groupName={group.group_name}
                                groupDesc={group.group_desc}
                                groupId={group.group_id}
                            />)}
                    </div>
                </div>
            :
                null
        )
    }
}

export default SearchGroupsModal 