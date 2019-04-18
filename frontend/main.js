// Test??


let button = document.getElementById('button')

button.addEventListener('click', login)

function login(){
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    payload = {
        body: JSON.stringify({'email': email, 'password': password}),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    fetch("http://127.0.0.1:8080/api/login", payload)
    .then(resp => {
        return resp.json()
    })
    .then(data => {
        alert(data)
    })
}

// function doElse(){
//     payload = {
//         methods: 'GET',
//         headers: {'Authorization': localStorage.getItem('token')}
//     }

//     fetch("http://127.0.0.1:8080/api/my_invites", payload)
//     .then(resp => {
//         return resp.json()
//     })
//     .then(data => {
//         alert(data)
//     })
// }