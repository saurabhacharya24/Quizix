
let button = document.getElementById('enter')
let get = document.getElementById('get')

button.addEventListener('click', doSomething)
get.addEventListener('click', doElse)

function doSomething(){
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
        localStorage.setItem('token', data)
    })
}

function doElse(){
    payload = {
        methods: 'GET',
        headers: {'Authorization': localStorage.getItem('token')}
    }

    fetch("http://127.0.0.1:8080/api/my_invites", payload)
    .then(resp => {
        return resp.json()
    })
    .then(data => {
        console.log(data)
    })
}