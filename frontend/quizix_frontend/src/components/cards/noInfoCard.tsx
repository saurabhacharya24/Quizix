import React from 'react'

interface State {}
interface Props {
    infoMessage: string
}

class NoInfoCard extends React.Component<Props, State> {

    render() {
        return (
            <div className="no-info-card">
                <p className="info-message">{ this.props.infoMessage }</p>
            </div>
        )
    }
}

export default NoInfoCard