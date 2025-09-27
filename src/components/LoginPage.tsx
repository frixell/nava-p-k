import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { startLogin } from '../actions/auth';
import { ThunkDispatch } from 'redux-thunk';

interface User {
    userEmail: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const navigate = useNavigate();

    const onSubmit = useCallback((user: User): Promise<boolean> => {
        console.log('LoginPage onSubmit called with user:', user);

        return (dispatch(startLogin(user.userEmail, user.password)) as any)
            .then((res: any) => {
                console.log('login page SUCCESS - res =', res);
                // If we reach here, login was successful
                navigate('/');
                return true;
            })
            .catch((error: any) => {
                console.log('login page ERROR - error =', error);
                console.log('Error type:', typeof error);
                console.log('Error details:', error?.code, error?.message);
                // If we reach here, login failed
                return false;
            });
    }, [dispatch, navigate]);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Please sign in to your account</p>
                </div>
                <LoginForm
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};

export default LoginPage;