import React from 'react';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userEmail: props.user ? props.user.userEmail : '',
            password: props.user ? props.user.password : '',
            connecting: false,
            error: ''
        }
    }
    onUserEmailChange = (e) => {
        const userEmail = e.target.value;
        this.setState(() => ({ userEmail }));
    };
    onPasswordChange = (e) => {
        const password = e.target.value;
        this.setState(() => ({ password }));
    };
    
    onSubmit = (e) => {
        e.preventDefault();
        if (!this.state.userEmail || !this.state.password) {
            //set error state to 'Please provide description and amount'
            this.setState(() => ({ error: 'Please provide user email and password' }));
        } else {
            //cleare error message
            this.setState(() => ({
                error: '',
                connecting: true
            }));
            //console.log('submitted');
            this.props.onSubmit({
                userEmail: this.state.userEmail,
                password: this.state.password
            }).then((res) => {
                if (res === false) {
                    this.setState(() => ({
                        error: 'Please provide valid user name and password',
                        connecting: false
                    }));
                }
            });
        }
    };
    render() {
        return (
            <div className="login-form">
                { this.state.error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        { this.state.error }
                    </div>
                )}
                { this.state.connecting ? (
                        <div className="connecting-state">
                            <div className="spinner"></div>
                            <p>Signing you in...</p>
                        </div>
                    ) : (
                        <form onSubmit={this.onSubmit} className="login-form-inputs">
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoFocus
                                    value={this.state.userEmail}
                                    onChange={this.onUserEmailChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={this.onPasswordChange}
                                    className="form-input"
                                />
                            </div>
                            <button type="submit" className="login-button">
                                Sign In
                            </button>
                        </form>
                    )
                }
            </div>
        )
    }
}