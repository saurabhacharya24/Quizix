import React from 'react';
import axios from 'axios';

interface State {
    whichView: number;
}

interface Props {}

class Dashboard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { whichView: 1 };
    }

    render() {
        return (
            <div className="dashboard">
                <p className="DEBUG"> This is the dashboard </p>
            </div>
        )
    }
}

export default Dashboard;