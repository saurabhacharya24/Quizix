import React from 'react';
// import ReactDOM from 'react-dom';

interface State {
    email: string;
    password: string;
    whichView: string;
}
interface Props {}

class LoginAndRegister extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { 
            email: "", 
            password: "",
            whichView: "login"
        }

        this.changeEmailState = this.changeEmailState.bind(this);
        this.changePasswordState = this.changePasswordState.bind(this);
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

    toggleView() {
        let { whichView } = this.state;
        this.setState({ whichView: whichView === "login" ? "register" : "login" })
    }

    render() {
        return (
            <div className="login-box">
                <div className="login-logo" />
                <p className="email-text"> Email </p>
                <input className="email-input" onChange={ this.changeEmailState }/>
                <p className="password-text"> Password </p>
                <input className="password-input" type="password" onChange={ this.changePasswordState }/>
                <button className="login-button" type="submit" > Login </button>
                <p className="if-register-text"> Don't have an account? 
                    <p className="register-toggle" onClick={ this.toggleView }> Click here </p> to register.</p>
            </div>
        )
    }
}

export default LoginAndRegister;