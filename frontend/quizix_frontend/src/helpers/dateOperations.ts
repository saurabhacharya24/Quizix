export function quizTimeRemaining(availableTo: Date): string {

    let currDays = new Date().getDate()
    let availDays = new Date(availableTo).getUTCDate()
    let currHours = new Date().getHours()
    let availHours = new Date(availableTo).getUTCHours()
    let currMins = new Date().getMinutes()
    let availMins = new Date(availableTo).getUTCMinutes()
    
    let daysDiff = availDays - currDays
    let hoursDiffDifferentDay = 24 - (currHours - availHours)
    let hoursDiffSameDay = availHours - currHours

    if (daysDiff > 1) {
        let cDate = new Date().getTime()
        let aDate = new Date(availableTo).getTime()
        let daysD = Math.floor(Math.abs(cDate - aDate) / (1000 * 60 * 60 * 24))
        
        return daysD.toString() + " days left"
    }

    if (daysDiff >= 1 && hoursDiffDifferentDay >= 24) {
        return daysDiff === 1 ? "1 day left" : daysDiff.toString() + " days left"
    }
    
    if (daysDiff === 1 && hoursDiffDifferentDay < 24) {
        if (hoursDiffDifferentDay > 1) {
            return hoursDiffDifferentDay.toString() + " hours left"
        }
        else {
            let minsDiff = 24 - (currMins - availMins)
            return minsDiff.toString() + " mins left!"
        }
    }

    if (daysDiff < 1) {
        if (hoursDiffSameDay > 1) {
            return hoursDiffSameDay.toString() + " hours left"
        }
        else if (hoursDiffSameDay === 1) {
            let minsDiff = 60 - currMins + availMins
            if (availMins >= currMins) {
                return "1 hour left"
            }
            else {
                return minsDiff.toString() + " mins left!"
            }
        }

        else {
            let mins = availMins === 0 ? 60 : availMins
            let mins2 = currMins === 0 ? 60 : currMins
            let minsDiff = mins - mins2
            return minsDiff.toString() + " mins left!"
        }
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
