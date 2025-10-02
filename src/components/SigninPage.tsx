import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SigninForm from './SigninForm';
import { startSignin } from '../store/slices/authSlice';
import {
    AuthCard,
    AuthHeader,
    AuthPage,
    AuthSubtitle,
    AuthTitle,
    SecondaryAction,
    SecondaryLink
} from './auth/AuthStyles';
import { useAppDispatch } from '../store/hooks';

interface Credentials {
    userEmail: string;
    password: string;
}

const SigninPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async (credentials: Credentials): Promise<boolean> => {
        try {
            await dispatch(startSignin({ email: credentials.userEmail, password: credentials.password }));
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
