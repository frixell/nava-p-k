import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import SigninForm from './SigninForm';
import { signin, AuthActionTypes } from '../actions/auth';
import {
    AuthCard,
    AuthHeader,
    AuthPage,
    AuthSubtitle,
    AuthTitle,
    SecondaryAction,
    SecondaryLink
} from './auth/AuthStyles';

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

    const navigateToLogin = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <AuthPage>
            <AuthCard>
                <AuthHeader>
                    <AuthTitle>Create account</AuthTitle>
                    <AuthSubtitle>Sign up to access the dashboard</AuthSubtitle>
                </AuthHeader>
                <SigninForm onSubmit={handleSubmit} />
                <SecondaryAction>
                    Already have an account?
                    <SecondaryLink type="button" onClick={navigateToLogin}>
                        Sign in
                    </SecondaryLink>
                </SecondaryAction>
            </AuthCard>
        </AuthPage>
    );
};

export default SigninPage;
