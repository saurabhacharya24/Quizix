export default function quizTimeRemaining(availaibleTo: Date): string {
    const DAYS = 1000 * 60 * 60 * 24
    const HOURS = DAYS / 24
    const MINS = HOURS / 60

    let currTime = Date.now()
    let availTime = new Date(availaibleTo).getTime()
    let daysRemaining = Math.floor(Math.abs(currTime - availTime) / DAYS)

    if (daysRemaining === 1) return "1 day left"
    else if (daysRemaining > 1) return daysRemaining + " days left"
    else {
        let hoursRemaining = Math.floor(Math.abs(currTime - availTime) / HOURS)

        if (hoursRemaining === 1) return "1 hour left"
        else if (hoursRemaining > 1) return hoursRemaining + " hours left"
        else {
            let minsRemaining = Math.floor(Math.abs(currTime - availTime) / MINS)

            if (minsRemaining === 1) return "1 minute left!"
            else return minsRemaining + " minutes left!"
        }
    }
}
