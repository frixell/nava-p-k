import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import LoginForm from './LoginForm';
import { startLogin } from '../actions/auth';
import { Dispatch } from 'redux';

interface User {
    userEmail: string;
    password: string;
}

interface LoginPageProps extends PropsFromRedux {}

export class LoginPage extends React.Component<LoginPageProps> {
    onSubmit = (user: User): Promise<boolean> => {
        return this.props.startLogin(user.userEmail, user.password).then((res: any) => {
            console.log('login page res = '+{...res});
            if (res) {
                return true;
            } else {
                return false;
            }
        });
    };

    render(): JSX.Element {
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
    startLogin: (userEmail: string, password: string) => dispatch(startLogin(userEmail, password))
});

const connector = connect(undefined, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LoginPage);