export interface IQuestion {
    qId: string
    question: string
    answers: Array<IAnswer>
    correctAnswer: string
}

interface IAnswer {
    aId: string
    ans: string
}