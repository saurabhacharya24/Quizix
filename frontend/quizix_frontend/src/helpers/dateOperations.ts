export function quizTimeRemaining(availableTo: Date): string {

    let availTime = new Date(availableTo).getTime()
    let currTime = new Date().getTime()

    let minsLeft = Math.floor(Math.abs((availTime - currTime) / 60000) - 600)
    let hours = Math.floor(Math.abs(availTime - currTime) / 36e5 - 10)

    if (hours >= 24) {
        let days = Math.floor(hours / 24)
        let daysText = days === 1 ? " day " : " days "
        return days.toString() + daysText + "left"
    }
    else if (hours < 24 && hours >= 1) {
        let hourText = hours === 1 ? " hour " : " hours "
        return hours.toString() + hourText + "left"
    }
    else if (hours < 1) {
        let minsText = minsLeft === 1 ? " min " : " mins "
        return minsLeft.toString() + minsText + "left!" 
    }

    return "N/A"
}

export function reviewTimeRemaining(reviewDate: Date): string {

    let reviewTime = new Date(reviewDate).getTime()
    let currTime = new Date().getTime()

    let minsLeft = Math.floor(Math.abs((reviewTime - currTime) / 60000) - 600)
    let hours = Math.floor(Math.abs(reviewTime - currTime) / 36e5 - 10)

    if (hours >= 24) {
        let days = Math.floor(hours / 24)
        let daysText = days === 1 ? " day " : " days"
        return days.toString() + daysText
    }
    else if (hours < 24 && hours >= 1) {
        let hourText = hours === 1 ? " hour " : " hours"
        return hours.toString() + hourText
    }
    else if (hours < 1) {
        let minsText = minsLeft === 1 ? " min " : " mins"
        return minsLeft.toString() + minsText
    }

    return "N/A"
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
