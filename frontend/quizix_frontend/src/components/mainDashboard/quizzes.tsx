import React from 'react'
import axios from 'axios'
// import QuizCard from './quizCard'
import { IQuizzes, ICompleted } from '../../interfaces/quizzes'
import getUserId from '../../helpers/cookies'
import QuizCard from '../cards/quizCard';
import CompletedCard from '../cards/completedCard'
import NoInfoCard from '../cards/noInfoCard'
import AttemptQuizModal from '../modals/attemptQuizInit'
import { API_URL, headerConfig } from '../../helpers/apiConsts'

interface State {
    quizzes: Array<IQuizzes>
    completedQuizzes: Array<ICompleted>
    quizzesLoaded: boolean
    completedQuizzesLoaded: boolean
    attemptQuizModalState: string
}
interface Props {
    goToReviewQuiz(quizId: string, marks: string): void
}

class Quizzes extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { 
            quizzes: [],
            completedQuizzes: [],
            quizzesLoaded: false,
            completedQuizzesLoaded: false,
            attemptQuizModalState: ""
        }

        this.goToReviewQuiz = this.goToReviewQuiz.bind(this)
        this.toggleAttemptQuizModalState = this.toggleAttemptQuizModalState.bind(this)
    }

    async componentDidMount() {
        let userId = getUserId()

        try {
            let response = await axios.get(API_URL+"/quiz_list?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ quizzes: data, quizzesLoaded: true })
        } catch (error) {
            if (error.response.data.code === 0) {
                this.setState({ quizzes: [], quizzesLoaded: true })
            }
        }

        try {
            let response = await axios.get(API_URL+"/completed_quizzes?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ completedQuizzes: data, completedQuizzesLoaded: true })
        } catch (error) {
            if (error.response.data.code === 0) {
                this.setState({ completedQuizzes: [], completedQuizzesLoaded: true })
            }
        }
    }

    goToReviewQuiz(quizId: string, marks: string) {
        this.props.goToReviewQuiz(quizId, marks)
    }

    toggleAttemptQuizModalState(quizName: string) {
        this.setState({ attemptQuizModalState: quizName })
     }

    render() {
        let { quizzes, quizzesLoaded, completedQuizzes, completedQuizzesLoaded, attemptQuizModalState } = this.state

        return (
            quizzesLoaded || completedQuizzesLoaded ?
            <div>
                <p className="upcoming-quizzes-text"> Upcoming Quizzes </p>
                <div className="quizzes">
                    {quizzes.length !== 0 ?
                        quizzes.map((quiz: IQuizzes) =>
                            <div>
                                <QuizCard
                                    key={quiz.quiz_id}
                                    availableTo={quiz.available_to} 
                                    quizName={quiz.quiz_name}
                                    groupName={quiz.group_name}
                                    quizId={quiz.quiz_id}
                                    toggleAttemptQuizModal={this.toggleAttemptQuizModalState}
                                />
                                <AttemptQuizModal
                                    quizName={quiz.quiz_name}
                                    quizDesc={quiz.quiz_desc}
                                    quizId={quiz.quiz_id}
                                    showState={attemptQuizModalState}
                                    toggleShowState={this.toggleAttemptQuizModalState}
                                    availableTo={quiz.available_to}
                                />
                                </div>)
                    :
                        <NoInfoCard infoMessage="No Quizzes due, Yay!"/>
                    }
                </div>
                <p className="completed-quizzes-text"> Completed Quizzes </p>
                <div className="completed-quizzes">
                    {completedQuizzes.length !== 0 ?
                        completedQuizzes.map((compQuiz: ICompleted) => 
                            <CompletedCard
                                key={compQuiz.quiz_id}
                                marks={compQuiz.marks}
                                quizName={compQuiz.quiz_name}
                                groupName={compQuiz.group_name}
                                quizId={compQuiz.quiz_id}
                                reviewDate={compQuiz.review_date}
                                goToReviewQuiz={this.goToReviewQuiz}
                            />)
                        :
                        <NoInfoCard infoMessage="No Completed Quizzes"/>
                    }
                </div>
            </div>
            :
            null
        )
    }
}

export default Quizzes

