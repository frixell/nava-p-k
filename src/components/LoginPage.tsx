import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useAppDispatch } from '../hooks';
import { loginUser } from '../reducers/auth';

interface User {
    userEmail: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = useCallback(async (user: User): Promise<boolean> => {
        try {
            await dispatch(loginUser({ userEmail: user.userEmail, password: user.password })).unwrap();
            navigate('/');
            return true;
        } catch (error) {
            // The thunk will be rejected on a failed login
            return false;
        }
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