import React from 'react'
import axios from 'axios'
import Quizzes from './quizzes'
import Groups from './groups'
import Messages from './messages'
import getUserId from '../../helpers/cookies'
import { API_URL, headerConfig } from '../../helpers/apiConsts'
import CreateQuiz from '../quizPages/createQuiz'
import ReviewQuiz from '../quizPages/reviewQuiz'
import AttemptQuiz from '../quizPages/attemptQuiz'


interface State {
    whichView: string
    quizMenuClass: string
    groupsMenuClass: string
    messagesMenuClass: string
    createQuizGroupId: string
    reviewQuizId: string
    reviewQuizMarks: string
    attemptQuizId: string
}

interface Props {}

class Dashboard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            whichView: "quizzes",
            quizMenuClass: "quiz-menu--selected",
            groupsMenuClass: "groups-menu",
            messagesMenuClass: "messages-menu",
            createQuizGroupId: "0",
            reviewQuizId: "0",
            reviewQuizMarks: "0",
            attemptQuizId: "0"
        };

        this.changeView = this.changeView.bind(this)
        this.goToReview = this.goToReview.bind(this)
        this.goToCreateQuiz = this.goToCreateQuiz.bind(this)
        this.goToAttemptQuiz = this.goToAttemptQuiz.bind(this)
        this.goToDashboardGroups = this.goToDashboardGroups.bind(this)
        this.goToDashboardQuizzes = this.goToDashboardQuizzes.bind(this)
        this.goToDashboardConfirmFirst = this.goToDashboardConfirmFirst.bind(this)
        this.logout = this.logout.bind(this)
    }

    changeView(evt: any) {
        let clickedMenu: string = evt.currentTarget.id
        let previousView = this.state.whichView
        
        if (clickedMenu === "js-quiz-menu") {
            if (previousView !== "quizzes") {
                this.setState({ 
                    whichView: "quizzes", 
                    quizMenuClass: "quiz-menu--selected",
                    groupsMenuClass: "groups-menu",
                    messagesMenuClass: "messages-menu"
                })   
            }
        }
        if (clickedMenu === "js-groups-menu") {
            if (previousView !== "groups") {
                this.setState({ 
                    whichView: "groups", 
                    quizMenuClass: "quiz-menu",
                    groupsMenuClass: "groups-menu--selected",
                    messagesMenuClass: "messages-menu"
                })   
            }
        }
        if (clickedMenu === "js-messages-menu") {
            if (previousView !== "messages") {
                this.setState({ 
                    whichView: "messages", 
                    quizMenuClass: "quiz-menu",
                    groupsMenuClass: "groups-menu",
                    messagesMenuClass: "messages-menu--selected"
                })
            }
        }
    }

    goToCreateQuiz(groupId: string) {
        this.setState({
            whichView: "createQuiz",
            createQuizGroupId: groupId,
        })
    }

    goToAttemptQuiz(quizId: string) {
        this.setState({
            whichView: "attemptQuiz",
            attemptQuizId: quizId
        })
    }

    goToReview(quizId: string, marks: string) {
        this.setState({
            whichView: "reviewQuiz",
            reviewQuizId: quizId,
            reviewQuizMarks: marks
        })
    }

    goToDashboardGroups() {
        this.setState({ whichView: "groups" })
    }

    goToDashboardQuizzes() {
        this.setState({ whichView: "quizzes" })
    }

    goToDashboardConfirmFirst() {
        if (window.confirm("Do you want to exit this quiz? Your answers for this attempt will not be saved.")) {
            this.setState({ whichView: "quizzes" })
        }
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
        let { whichView, createQuizGroupId, reviewQuizId, reviewQuizMarks, attemptQuizId } = this.state

        let quizName = attemptQuizId.split(":")[0]

        if (whichView === "quizzes") {
            return (
                <div className="dashboard">
                    <div className="logo-beside-title" />
                    <p className="dashboard-title"> My Dashboard </p>
                    {this.renderMenu()}
                    <Quizzes 
                        goToReviewQuiz={this.goToReview}
                        goToAttemptQuiz={this.goToAttemptQuiz}
                    />
                    {this.renderLogout()}
                </div>
            )
        }
        else if (whichView === "groups") {
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
        else if (whichView === "messages") {
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

        else if (whichView === "createQuiz") {
            return (
                <div className="create-quiz-page">
                    <div className="logo-beside-title" />
                    <p className="create-quiz-title"> Create Quiz </p>
                    <CreateQuiz groupId={createQuizGroupId}/>
                    <button className="back-to-dash-button" onClick={this.goToDashboardGroups}> Back </button>
                </div>
            )
        }

        else if (whichView === "reviewQuiz") {
            return (
                <div className="review-quiz-page">
                    <div className="logo-beside-title" />
                    <p className="review-quiz-title"> Quiz Review </p>
                    <ReviewQuiz quizId={reviewQuizId} reviewQuizMarks={reviewQuizMarks}/>
                    <button className="back-to-dash-button" onClick={this.goToDashboardQuizzes}> Back</button>
                </div>
            )
        }

        else if (whichView === "attemptQuiz") {
            return (
                <div className="attempt-quiz-page">
                    <div className="logo-beside-title" />
                    <p className="review-quiz-title"> {quizName} </p>
                    <AttemptQuiz quizId={attemptQuizId} />
                    <button className="back-to-dash-button" onClick={this.goToDashboardConfirmFirst}> Back </button>
                </div>
            )
        }
    }
}

export default Dashboard;