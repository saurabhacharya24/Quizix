import React from 'react'
import axios from 'axios'
// import QuizCard from './quizCard'
import { IQuizzes } from '../interfaces/quizzes'
import getUserId from '../helpers/cookies'
import QuizCard from './quizCard';

const API_URL = "http://127.0.0.1:8080/api";
const headerConfig = {
    headers: {
        'Content-Type': 'application/json',
        withCredentials: 'true'
    }
}

interface State {
    quizzes: Array<IQuizzes>
    quizzesLoaded: boolean
}
interface Props {}

class Quizzes extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { 
            quizzes: [],
            quizzesLoaded: false
        }
    }

    async componentDidMount() {
        let userId = getUserId()

        try {
            let response = await axios.get(API_URL+"/quiz_list?user_id="+userId, headerConfig)
            let data = await response.data
            this.setState({ quizzes: data, quizzesLoaded: true })
        } catch (error) {
            console.log(error.response.data)
        }
    }

    render() {
        let { quizzes, quizzesLoaded } = this.state

        return (
            quizzesLoaded ?
            <div>
                <p className="upcoming-quizzes-text"> Upcoming Quizzes </p>
                <div className="quizzes">
                    {quizzes.map((quiz: IQuizzes) =>
                        <QuizCard 
                            key={quiz.quiz_id}
                            availableTo={quiz.available_to} 
                            quizName={quiz.quiz_name}
                            groupName={quiz.group_name}
                        />
                    )}
                </div>
            </div>
            :
            null
        )
    }
}

export default Quizzes

