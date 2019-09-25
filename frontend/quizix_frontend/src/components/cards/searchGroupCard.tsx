import React from 'react'

interface Props {
    groupName: string,
    groupDesc: string,
    groupId: number
}

const SearchGroupCard = (props: Props) => {
    let { groupName, groupDesc } = props
    
    return (
        <div className="search-group-card">
            <p className="group-name"> {groupName} </p>
            <button className="join-group-button"> Join </button> 
            <p className="group-desc"> {groupDesc} </p>
        </div>
    )
}

export default SearchGroupCard