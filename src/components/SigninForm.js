import React from 'react';

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
                    console.log('connecting false');
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