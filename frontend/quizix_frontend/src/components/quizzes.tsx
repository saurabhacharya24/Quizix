import React from 'react'
import axios from 'axios'
// import QuizCard from './quizCard'
import { IQuizzes, ICompleted } from '../interfaces/quizzes'
import getUserId from '../helpers/cookies'
import QuizCard from './quizCard';
import CompletedCard from './completedCard'
import NoInfoCard from './noInfoCard'

const API_URL = "http://127.0.0.1:8080/api";
const headerConfig = {
    headers: {
        'Content-Type': 'application/json',
        withCredentials: 'true'
    }
}

interface State {
    quizzes: Array<IQuizzes>
    completedQuizzes: Array<ICompleted>
    quizzesLoaded: boolean
    completedQuizzesLoaded: boolean
}
interface Props {}

class Quizzes extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { 
            quizzes: [],
            completedQuizzes: [],
            quizzesLoaded: false,
            completedQuizzesLoaded: false
        }
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

    render() {
        let { quizzes, quizzesLoaded, completedQuizzes, completedQuizzesLoaded } = this.state

        return (
            quizzesLoaded || completedQuizzesLoaded ?
            <div>
                <p className="upcoming-quizzes-text"> Upcoming Quizzes </p>
                <div className="quizzes">
                    {quizzes.length !== 0 ?
                        quizzes.map((quiz: IQuizzes) =>
                            <QuizCard 
                                key={quiz.quiz_id}
                                availableTo={quiz.available_to} 
                                quizName={quiz.quiz_name}
                                groupName={quiz.group_name}
                                quizId={quiz.quiz_id}
                            />)
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

