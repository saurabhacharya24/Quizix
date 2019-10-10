import React from 'react';
import axios from 'axios';
// import ReactDOM from 'react-dom';
import { API_URL, headerConfig } from '../helpers/apiConsts'

interface State {
    email: string
    password: string
    registerEmail: string
    registerUsername: string
    registerPassword: string
    invalidLoginTextClass: string
    invalidRegTextClass: string
    whichView: string
}
interface Props {}

class LoginAndRegister extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { 
            email: "", 
            password: "",
            registerEmail: "",
            registerUsername: "",
            registerPassword: "",
            invalidLoginTextClass: "invalid-login-text--hidden",
            invalidRegTextClass: "invalid-reg-text--hidden",
            whichView: "login"
        }

        this.changeEmailState = this.changeEmailState.bind(this)
        this.changePasswordState = this.changePasswordState.bind(this)
        this.changeRegisterEmailState = this.changeRegisterEmailState.bind(this)
        this.changeRegisterUsernameState = this.changeRegisterUsernameState.bind(this)
        this.changeRegisterPasswordState = this.changeRegisterPasswordState.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.registerUser = this.registerUser.bind(this)
        this.onlyGoToRegister = this.onlyGoToRegister.bind(this)
        this.toggleView = this.toggleView.bind(this)
    }

    changeEmailState(evt: any) {
        let email: string = evt.currentTarget.value;
        this.setState({ email: email });
    }

    changePasswordState(evt: any) {
        let pass: string = evt.currentTarget.value;
        this.setState({ password: pass });
    }

    changeRegisterEmailState(evt: any) {
        let registerEmail: string = evt.currentTarget.value;
        this.setState({ registerEmail: registerEmail });
    }

    changeRegisterUsernameState(evt: any) {
        let username: string = evt.currentTarget.value;
        this.setState({ registerUsername: username });
    }

    changeRegisterPasswordState(evt: any) {
        let pass: string = evt.currentTarget.value;
        this.setState({ registerPassword: pass });
    }

    async loginUser() {
        let { email, password } = this.state;

        let body = {
            email: email,
            password: password 
        }

        try {
            let response = await axios.post(API_URL+"/login", body, headerConfig)
            let userId = response.data['user_id']

            document.cookie = "user_id=" + userId
            window.location.reload()

            this.setState({ invalidLoginTextClass: "invalid-login-text--hidden" })
            
        } catch (error) {
            this.setState({ invalidLoginTextClass: "invalid-login-text" })
            let state = this

            setTimeout(function() {
                state.setState({ invalidLoginTextClass: "invalid-login-text--hidden"})
            }, 2000)
        }
    }

    async registerUser() {
        let { registerEmail, registerUsername, registerPassword } = this.state

        let body = {
            email: registerEmail,
            password: registerPassword,
            display_name: registerUsername
        }

        try {
            let response = await axios.post(API_URL+"/registration", body, headerConfig)
            let userId = response.data['user_id']
            console.log(response.data)

            document.cookie = "user_id=" + userId
            window.location.reload()

        } catch (error) {
            console.log(error.response.data)
            this.setState({ invalidRegTextClass: "invalid-reg-text" })
            let state = this

            setTimeout(function() {
                state.setState({ invalidRegTextClass: "invalid-reg-text--hidden"})
            }, 2000)
        }
    }

    onlyGoToRegister() {
        let { whichView } = this.state

        if (whichView === "login") {
            this.setState({ whichView: "register" })
            this.clearState()

            let emailField = (document.getElementById('js-email') as HTMLInputElement)
            let passwordField = (document.getElementById('js-pass') as HTMLInputElement);
            let usernameField = (document.getElementById('js-username') as HTMLInputElement);

            emailField.value = '';
            passwordField.value = '';
            if (usernameField != null) usernameField.value = '';
        }
    }

    toggleView() {
        let { whichView } = this.state

        this.setState({ 
            whichView: whichView === "login" ? "register" : "login",
        })
        this.clearState()

        let emailField = (document.getElementById('js-email') as HTMLInputElement)
        let passwordField = (document.getElementById('js-pass') as HTMLInputElement);
        let usernameField = (document.getElementById('js-username') as HTMLInputElement);

        emailField.value = '';
        passwordField.value = '';
        if (usernameField != null) usernameField.value = '';
        
    }

    clearState(){
        this.setState({ 
            email: "",
            password: "",
            registerEmail: "",
            registerUsername: "",
            registerPassword: ""
        })
    }

    renderLoginOnly() {
        return (
            <div className="login-register-box">
                <div className="login-logo" />
                <p className="email-text"> Email </p>
                <input id="js-email" className="email-input" onChange={ this.changeEmailState } name="email"/>
                <p className="password-text"> Password </p>
                <input id="js-pass" className="password-input" type="password" onChange={ this.changePasswordState }/>
                <button className="login-button" type="submit" onClick={ this.loginUser }> Login </button>
                <p className={this.state.invalidLoginTextClass}> Incorrect email/password </p>
                <p className="if-register-text"> Don't have an account? 
                    <p className="register-toggle" onClick={ this.toggleView }> Click here </p> to register.</p>
            </div>
        )
    }

    renderRegisterOnly() {
        return (
            <div className="login-register-box">
                <div className="login-logo" />
                <p className="email-register-text"> Email </p>
                <input id="js-email" className="email-register-input" onChange={ this.changeRegisterEmailState }/>
                <p className="username-register-text"> Username <p className="username-rule-text"> (must be greater than 5 characters) </p></p>
                <input id="js-username" className="username-register-input" onChange={ this.changeRegisterUsernameState } />
                <p className="password-register-text"> Password </p>
                <input id="js-pass"className="password-register-input" type="password" onChange={ this.changeRegisterPasswordState }/>
                <button className="register-button" type="submit" onClick={ this.registerUser }> Register </button>
                <p className={this.state.invalidRegTextClass}> Couldn't register, please try again </p>
                <p className="login-toggle" onClick={ this.toggleView }> Back to Login </p>
            </div>
        ) 
    }

    render() {
        let { whichView } = this.state;

        return (    
            whichView === "login" ? this.renderLoginOnly() : this.renderRegisterOnly()
        )   
    }
}

export default LoginAndRegister;