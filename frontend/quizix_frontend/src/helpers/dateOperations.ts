export function quizTimeRemaining(availableTo: Date): string {
    const DAYS = 1000 * 60 * 60 * 24
    const HOURS = DAYS / 24
    const MINS = HOURS / 60

    let currTime = Date.now()
    let availTime = new Date(availableTo).getTime()
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

export function formatDateTime(dateTime: Date): string {
    let day = dateTime.getDate().toString()
    let month = (dateTime.getMonth()+1).toString()
    let dayFormatted = day.length === 1 ? "0"+day : day
    let monthFormatted = month.length === 1 ? "0"+month : month

    let hours = dateTime.getHours().toString()
    let mins = dateTime.getMinutes().toString()
    let hoursFormatted = hours.length === 1 ? "0"+hours : hours
    let minsFormatted = mins.length === 1 ? "0"+mins: mins

    let year = dateTime.getFullYear().toString()

    return year+"-"+monthFormatted+"-"+dayFormatted+" "+hoursFormatted+":"+minsFormatted+":00"
}

export function formatDate(date: Date): string {
    let day = date.getDate().toString()
    let month = (date.getMonth()+1).toString()
    let dayFormatted = day.length === 1 ? "0"+day : day
    let monthFormatted = month.length === 1 ? "0"+month : month

    let year = date.getFullYear().toString()

    return year+"-"+monthFormatted+"-"+dayFormatted+" 23:59:55"
}
