import React from 'react';
import { connect } from 'react-redux';
import SigninForm from './SigninForm';
import { signin } from '../actions/auth';

export class SigninPage extends React.Component {
    onSubmit = (user) => {
        return this.props.signin( user.userEmail, user.password )
            .then(() => {
                // Signup successful, redirect to let them log in
                this.props.history.push('/');
                return true;
            })
            .catch((error) => {
                // The promise from the service rejects with an error object.
                console.error("Signup failed:", error.message);
                // The SigninForm likely expects a boolean to control its state.
                // Returning false indicates failure.
                return false;
            });
    };
    render() {
        return (
            <div>
                <h1>Sign In</h1>
                <SigninForm
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    signin: (userEmail, password) => dispatch(signin(userEmail, password))
});

export default connect(undefined, mapDispatchToProps)(SigninPage);