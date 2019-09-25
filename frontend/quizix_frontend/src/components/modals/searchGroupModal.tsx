import React from 'react'
import { ISearchGroups } from '../../interfaces/groups'

interface State {}
interface Props {
    showState: boolean
    searchGroups: Array<ISearchGroups>
    toggleShowState(): void
}

class SearchGroupsModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.toggleShowStateLocal = this.toggleShowStateLocal.bind(this)
    }

    toggleShowStateLocal() {
        this.props.toggleShowState()
    }

    render() {
        let { showState, searchGroups } = this.props
        return (
            showState ?
                <div className="modal">
                    <div className="search-groups-box">
                        <span className="close-modal" onClick={this.toggleShowStateLocal}> &times; </span>
                        <p className="search-info"> Search for groups by name, and they'll be shown below </p>
                        <input className="search-groups-input" />
                    </div>
                    <div className="search-groups-result">
                        <p> DEBUG </p>
                    </div>
                </div>
            :
                null
        )
    }
}

export default SearchGroupsModal 