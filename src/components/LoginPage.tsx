import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import LoginForm from './LoginForm';
import { startLogin } from '../actions/auth';
import { Dispatch } from 'redux';

interface User {
    userEmail: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<Dispatch>();

    const onSubmit = useCallback((user: User): Promise<boolean> => {
        return dispatch(startLogin(user.userEmail, user.password)).then((res: any) => {
            console.log('login page res = '+{...res});
            if (res) {
                return true;
            } else {
                return false;
            }
        });
    }, [dispatch]);

    return (
        <div>
            <h1>Login</h1>
            <LoginForm
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default LoginPage;