import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { startLogin, AuthActionTypes } from '../actions/auth';
import { ThunkDispatch } from 'redux-thunk';

interface User {
    userEmail: string;
    password: string;
}

interface RootState {
    auth: { uid?: string };
    [key: string]: any;
}

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AuthActionTypes>>();
    const navigate = useNavigate();
    
    const user = {
        userEmail: 'mosh@frixell.net',
        password: 'nava123'
    };

    const onSubmit = useCallback((user: User): Promise<boolean> => {
        // HARDCODED for development
        const hardcodedUser = {
            userEmail: 'mosh@frixell.net',
            password: 'nava123'
        };

        return dispatch(startLogin(hardcodedUser.userEmail, hardcodedUser.password))
            .then(() => {
                // If we reach here, login was successful
                navigate('/');
                return true;
            })
            .catch(() => {
                // If we reach here, login failed
                return false;
            });
    }, [dispatch, navigate]);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">Welcome</h1>
                    <p className="login-subtitle">Please sign in to your account</p>
                </div>
                <LoginForm
                    user={user}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};

export default LoginPage;