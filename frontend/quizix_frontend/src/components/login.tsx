import React from 'react';
import axios from 'axios';
// import ReactDOM from 'react-dom';
const API_URL = "http://127.0.0.1:8080/api/";

interface State {
    email: string;
    password: string;
    registerEmail: string;
    registerUsername: string;
    registerPassword: string
    whichView: string;
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
            whichView: "login"
        }

        this.changeEmailState = this.changeEmailState.bind(this);
        this.changePasswordState = this.changePasswordState.bind(this);
        this.changeRegisterEmailState = this.changeEmailState.bind(this);
        this.changeRegisterUsernameState = this.changeRegisterUsernameState.bind(this);
        this.changeRegisterPasswordState = this.changeRegisterPasswordState.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.toggleView = this.toggleView.bind(this);
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

        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let response = await axios.post(API_URL+"login", body, config);
        console.log(response.data);
    }
 
    toggleView() {
        let { whichView } = this.state;
        this.setState({ 
            whichView: whichView === "login" ? "register" : "login",
            email: "",
            password: "",
            registerEmail: "",
            registerUsername: "",
            registerPassword: ""
        });

        let emailField = (document.getElementById('js-email') as HTMLInputElement)
        let passwordField = (document.getElementById('js-pass') as HTMLInputElement);
        let usernameField = (document.getElementById('js-username') as HTMLInputElement);

        emailField.value = '';
        passwordField.value = '';
        if (usernameField != null) usernameField.value = '';
        
    }

    renderLoginOnly() {
        return (
            <div className="login-register-box">
                <div className="login-logo" />
                <p className="email-text"> Email </p>
                <input id="js-email" className="email-input" onChange={ this.changeEmailState }/>
                <p className="password-text"> Password </p>
                <input id="js-pass" className="password-input" type="password" onChange={ this.changePasswordState }/>
                <button className="login-button" type="submit" onClick={ this.loginUser }> Login </button>
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
                <button className="register-button" type="submit" > Register </button>
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