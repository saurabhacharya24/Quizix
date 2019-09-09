import React from 'react'
import axios from 'axios'
import getUserId from '../helpers/cookies'

const API_URL = "http://127.0.0.1:8080/api";
const headerConfig = {
    headers: {
        'Content-Type': 'application/json',
        withCredentials: 'true'
    }
}

interface State {
    whichView: number
    quizMenuClass: string
    groupsMenuClass: string
    messagesMenuClass: string
}

interface Props {}

class Dashboard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            whichView: 1,
            quizMenuClass: "quiz-menu--selected",
            groupsMenuClass: "groups-menu",
            messagesMenuClass: "messages-menu"
        };

        this.changeView = this.changeView.bind(this)
        this.logout = this.logout.bind(this)
    }

    changeView(evt: any) {
        let clickedMenu: string = evt.currentTarget.id
        let previousView = this.state.whichView
        
        if (clickedMenu === "js-quiz-menu") {
            this.toggleQuizMenuState()
            this.setState({ whichView: 1 })   
        }
        if (clickedMenu === "js-groups-menu") {
            this.toggleGroupsMenuState()   
            this.setState({ whichView: 2 })
        }
        if (clickedMenu === "js-messages-menu") {
            this.toggleMessagesMenuState()   
            this.setState({ whichView: 3 })
        }

        if (previousView === 1) this.toggleQuizMenuState()
        if (previousView === 2) this.toggleGroupsMenuState()
        if (previousView === 3) this.toggleMessagesMenuState()
    }

    toggleQuizMenuState() {
        let { quizMenuClass } = this.state
        this.setState({ quizMenuClass: quizMenuClass === "quiz-menu" ? "quiz-menu--selected" : "quiz-menu" })
    }

    toggleGroupsMenuState() {
        let { groupsMenuClass } = this.state
        this.setState({ groupsMenuClass: groupsMenuClass === "groups-menu" ? "groups-menu--selected" : "groups-menu" })
    }

    toggleMessagesMenuState() {
        let { messagesMenuClass } = this.state
        this.setState({ messagesMenuClass: messagesMenuClass === "messages-menu" ? "messages-menu--selected" : "messages-menu" })
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
        return (
            <div className="dashboard">
                <p className="dashboard-title"> My Dashboard </p>
                {this.renderMenu()}
                {this.renderLogout()}
            </div>
        )
    }
}

export default Dashboard;