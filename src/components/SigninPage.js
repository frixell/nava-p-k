import React from 'react';
import { connect } from 'react-redux';
import SigninForm from './SigninForm';
import { signin } from '../actions/auth';

export class SigninPage extends React.Component {
    onSubmit = (user) => {
        return this.props.signin( user.userEmail, user.password ).then(( res ) => {
            console.log('signin page res = '+res);
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