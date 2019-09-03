import React from 'react';
import ReactDOM from 'react-dom';

interface State {}
interface Props {}

class Homepage extends React.Component<Props, State> {

    render() {
        return (
            <div className="homepage--main-image" title="Quizix homepage image"/>
        )
    }
}

export default Homepage;