import React from 'react'
import axios from 'axios'
import Quizzes from './quizzes'
import Groups from './groups'
import Messages from './messages'
import getUserId from '../../helpers/cookies'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import CreateQuiz from '../quizPages/createQuiz'


interface State {
    whichView: number
    quizMenuClass: string
    groupsMenuClass: string
    messagesMenuClass: string
    createQuizGroupId: string
}

interface Props {}

class Dashboard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            whichView: 1,
            quizMenuClass: "quiz-menu--selected",
            groupsMenuClass: "groups-menu",
            messagesMenuClass: "messages-menu",
            createQuizGroupId: "0"
        };

        this.changeView = this.changeView.bind(this)
        this.goToCreateQuiz = this.goToCreateQuiz.bind(this)
        this.goToDashboard = this.goToDashboard.bind(this)
        this.logout = this.logout.bind(this)
    }

    changeView(evt: any) {
        let clickedMenu: string = evt.currentTarget.id
        let previousView = this.state.whichView
        
        if (clickedMenu === "js-quiz-menu") {
            if (previousView !== 1) {
                this.setState({ 
                    whichView: 1, 
                    quizMenuClass: "quiz-menu--selected",
                    groupsMenuClass: "groups-menu",
                    messagesMenuClass: "messages-menu"
                })   
            }
        }
        if (clickedMenu === "js-groups-menu") {
            if (previousView !== 2) {
                this.setState({ 
                    whichView: 2, 
                    quizMenuClass: "quiz-menu",
                    groupsMenuClass: "groups-menu--selected",
                    messagesMenuClass: "messages-menu"
                })   
            }
        }
        if (clickedMenu === "js-messages-menu") {
            if (previousView !== 3) {
                this.setState({ 
                    whichView: 3, 
                    quizMenuClass: "quiz-menu",
                    groupsMenuClass: "groups-menu",
                    messagesMenuClass: "messages-menu--selected"
                })
            }
        }
    }

    goToCreateQuiz(groupId: string) {
        this.setState({
            whichView: 4,
            createQuizGroupId: groupId
        })
    }

    goToDashboard() {
        this.setState({ whichView: 2 })
    }

    async logout() {
        let userId = getUserId()
        try {
            let response = await axios.delete(API_URL+"/logout?user_id="+userId, headerConfig)
            
            if(response.status === 200) {
                document.cookie = "user_id=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                window.location.reload()
            }
        } catch (error) {
            console.log(error.response.data)
        }
    }

    renderLogout() {
        return (
            <div className="logout" onClick={ this.logout }>
                <div className="logout-image" />
                <p className="logout-text"> Logout </p>
            </div>
        )
    }

    renderMenu() {
        let { quizMenuClass, groupsMenuClass, messagesMenuClass } = this.state
        return (
            <div className="menu">
                <div id="js-quiz-menu" className={ quizMenuClass } onClick={ this.changeView }>
                    <p className="quiz-menu-text"> Quizzes </p>
                </div>
                <div id="js-groups-menu" className={ groupsMenuClass } onClick={ this.changeView }>
                    <p className="groups-menu-text"> Groups </p>
                </div>
                <div id="js-messages-menu" className={ messagesMenuClass } onClick={ this.changeView }>
                    <p className="messages-menu-text"> Messages </p>
                </div>
            </div>
        )
    }

    render() {
        let { whichView, createQuizGroupId } = this.state

        if (whichView === 1) {
            return (
                <div className="dashboard">
                    <div className="logo-beside-title" />
                    <p className="dashboard-title"> My Dashboard </p>
                    {this.renderMenu()}
                    <Quizzes />
                    {this.renderLogout()}
                </div>
            )
        }
        else if (whichView === 2) {
            return (
                <div className="dashboard">
                    <div className="logo-beside-title" />
                    <p className="dashboard-title"> My Dashboard </p>
                    {this.renderMenu()}
                    <Groups goToCreateQuiz={this.goToCreateQuiz}/>
                    {this.renderLogout()}
                </div>
            )
        }
        else if (whichView === 3) {
            return (
                <div className="dashboard">
                    <div className="logo-beside-title" />
                    <p className="dashboard-title"> My Dashboard </p>
                    {this.renderMenu()}
                    <Messages />
                    {this.renderLogout()}
                </div>
            )
        }

        else if (whichView === 4) {
            return (
                <div className="create-quiz-page">
                    <div className="logo-beside-title" />
                    <p className="create-quiz-title"> Create Quiz </p>
                    <CreateQuiz groupId={createQuizGroupId}/>
                    <button className="back-to-dash-button" onClick={this.goToDashboard}> Back </button>
                </div>
            )
        }
    }
}

export default Dashboard;