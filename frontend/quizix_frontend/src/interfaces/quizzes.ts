export interface IQuizzes {
    available_to: Date
    group_name: string
    quiz_id: string
    quiz_name: string
}

export interface ICompleted {
    group_name: string
    marks: string
    quiz_id: string
    quiz_name: string
    review_date: Date
}