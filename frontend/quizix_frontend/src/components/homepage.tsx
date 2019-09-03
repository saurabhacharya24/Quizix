import React from 'react';
import LoginAndRegister from './login';
// import ReactDOM from 'react-dom';

interface State {}
interface Props {}

class Homepage extends React.Component<Props, State> {

    render() {
        return (
            <div className="homepage">
                <div className="homepage--main-image" title="Quizix homepage image"/>
                <LoginAndRegister />
                <div className="slogan-main"> A Slogan, Dis is Slogan</div>
                <p className="slogan-para"> 
                    Quizix description and stuff
                    Lorem ipsum dolor sit amet, consectetur adipiscing 
                    elit, sed do eiusmod tempor incididunt ut labore 
                    et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip.
                </p>
            </div>
        )
    }
}

export default Homepage;