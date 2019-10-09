import React from 'react'
import LoginAndRegister from './login'
import Dashboard from './mainDashboard/dashboard'
import getUserId from '../helpers/cookies'
// import ReactDOM from 'react-dom';

interface State {}
interface Props {}

class Homepage extends React.Component<Props, State> {

    renderHomepage() {
        return (
            <div className="homepage">
                <div className="top-part">
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
                <div className="bottom-part">
                    <p className="why-choose-text"> Why Choose Quizix? </p>
                    <div className="bottom-part-info">
                        <div className="info">
                            <div className="img-1" title="img1" />
                            <p className="info-header"> Easy to use for anyone </p>
                            <p className="info-text"> 
                                Quizix is simple for everyone and 
                                allows people to achieve what they 
                                want in as few steps as possible. 
                            </p>
                        </div>
                        <div className="info">
                            <div className="img-2" title="img1" />
                            <p className="info-header"> Create and join groups </p>
                            <p className="info-text"> 
                                Anyone can create or join
                                groups in Quizix. Groups allow 
                                people to send their quizzes
                                to many people at the same time.
                            </p>
                        </div>
                        <div className="info">
                            <div className="img-3" title="img1" />
                            <p className="info-header"> Create Quizzes as you wish </p>
                            <p className="info-text">
                                With the ability to set start date/time,
                                end date/time, quiz visibility
                                and more, you can create quizzes 
                                any way you want.
                            </p>
                        </div>
                        <div className="info">
                            <div className="img-4" title="img1" />
                            <p className="info-header"> Invite others in just 2 steps </p>
                            <p className="info-text">
                                Simply search for a person and
                                invite them to your group -
                                it's that simple.
                            </p>
                        </div>
                        <div className="info">
                            <div className="img-5" title="img1" />
                            <p className="info-header"> Stay on top of things </p>
                            <p className="info-text">
                                You'll get messages whenever 
                                someone invites you or requests you 
                                to join their group.
                            </p>
                        </div>
                        <div className="info">
                            <div className="img-6" title="img1" />
                            <p className="info-header"> Review a quiz </p>
                            <p className="info-text">
                                See what you got right and what
                                you got wrong in a quiz, helping you
                                to gain an advantage in the future.
                            </p>
                        </div>
                        <div />
                        <div className="info">
                            <div className="img-7" title="img1" />
                            <p className="info-header"> Quiz deadlines and alerts </p>
                            <p className="info-text">
                                We will always tell you when a quiz
                                is due and alert you if a quiz is due
                                very soon.
                            </p>
                        </div>
                        <div />
                    </div>
                    <div className="test">
                        <p> Footer </p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        let userId = getUserId()
        return (
            userId.length > 0 ?
            <div>
                <Dashboard />
            </div>
            :
            <div>
                {this.renderHomepage()}
            </div>
        )
    }
}

export default Homepage;