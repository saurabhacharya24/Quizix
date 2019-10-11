export interface IQuizzes {
    available_to: Date
    group_name: string
    quiz_id: string
    quiz_name: string
    quiz_desc: string
    num_of_questions: number
}

export interface ICompleted {
    group_name: string
    marks: string
    quiz_id: string
    quiz_name: string
    review_date: Date
}