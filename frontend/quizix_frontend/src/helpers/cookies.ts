function getUserId() {
    let cookies = document.cookie
    let userId = ""
    let cookiesArray = cookies.split(";")
    
    cookiesArray.forEach(async cookie => {
        if (cookie.startsWith(" user_id")) {
            const myCookie = cookie
            userId = myCookie.trim().substring(8)
        }
    })

    return userId
}

export default getUserId