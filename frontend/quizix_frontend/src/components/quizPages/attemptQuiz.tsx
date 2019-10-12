import React from 'react'
import axios from 'axios'
import { API_URL } from '../../helpers/apiConsts'

interface State {
    questions: Array<any>
}

interface Props {
    quizId: string
} 

class AttemptQuiz extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = { questions: [] }
    }

    async componentDidMount() {
        let { quizId } = this.props

        try {
            let response = await axios.get(API_URL+"/questions?quiz_id="+quizId)
            let data = await response.data
            this.setState({ questions: data })
        } catch (error) {
            alert("Couldn't load quiz questions, please go to dashboard and try again or contact admin.")
        }
    }

    render() {
        return (
            <p> QuizId - {this.props.quizId} </p>
        )
    }
}

export default AttemptQuiz