import React from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import { startLogin } from '../actions/auth';

export class LoginPage extends React.Component {
    onSubmit = (user) => {
        return this.props.startLogin(user.userEmail, user.password).then((res) => {
            console.log('login page res = '+{...res});
            if (res) {
                return true;
            } else {
                return false;
            }
        });
    };
    render() {
        return (
            <div>
                <h1>Login</h1>
                <LoginForm
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startLogin: (userEmail, password) => dispatch(startLogin(userEmail, password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);