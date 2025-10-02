import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import SigninForm from './SigninForm';
import { signin, AuthActionTypes } from '../actions/auth';

interface Credentials {
    userEmail: string;
    password: string;
}

interface RootState {
    auth: { uid?: string };
    [key: string]: unknown;
}

const SigninPage: React.FC = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AuthActionTypes>>();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async (credentials: Credentials): Promise<boolean> => {
        try {
            await dispatch(signin(credentials.userEmail, credentials.password));
            navigate('/');
            return true;
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Signup failed:', error);
            }
            return false;
        }
    }, [dispatch, navigate]);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">Create account</h1>
                    <p className="login-subtitle">Sign up to access the dashboard</p>
                </div>
                <SigninForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default SigninPage;
