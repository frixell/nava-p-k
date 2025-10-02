import React from 'react';
import { validateLoginCredentials } from '../utils/validation';

export default class SigninForm extends React.Component {
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
        const validation = validateLoginCredentials({
            userEmail: this.state.userEmail,
            password: this.state.password
        }, {
            invalidCredentials: 'Please provide user email and password',
            invalidEmail: 'Please provide a valid email address',
            weakPassword: 'Password must contain at least 6 characters.'
        });

        if (!validation.isValid) {
            this.setState(() => ({ error: validation.message }));
            return;
        }

        this.setState(() => ({
            error: '',
            connecting: true
        }));

        this.props.onSubmit(validation.value).then((res) => {
            if (res === false) {
                this.setState(() => ({
                    error: 'Please provide valid user name and password',
                    connecting: false
                }));
            } else {
                this.setState(() => ({ connecting: false }));
            }
        }).catch((error) => {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Sign-in failed', error);
            }
            this.setState(() => ({
                error: 'Unable to sign in right now. Please try again later.',
                connecting: false
            }));
        });
    };
    render() {
        return (
            <div>
                { this.state.error && <p>{ this.state.error }</p> }
                { this.state.connecting ? (
                        <p>connecting...</p>
                    ) : (
                        <form onSubmit={this.onSubmit}>
                            <input
                                type="text"
                                placeholder="User Email"
                                autoFocus
                                value={this.state.userEmail}
                                onChange={this.onUserEmailChange}
                            />
                            <input
                                type="text"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onPasswordChange}
                            />
                            <button>Sign In</button>
                        </form>
                    )
                }
            </div>
        )
    }
}
