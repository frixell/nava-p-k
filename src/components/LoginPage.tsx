import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { startLogin } from '../store/slices/authSlice';
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

const DEV_CREDENTIALS: Credentials = {
    userEmail: 'mosh@frixell.net',
    password: 'nava123'
};

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const initialCredentials = useMemo(() => DEV_CREDENTIALS, []);

    const handleSubmit = useCallback(async (credentials: Credentials): Promise<boolean> => {
        try {
            await dispatch(startLogin({ email: credentials.userEmail, password: credentials.password }));
            navigate('/');
            return true;
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Login failed:', error);
            }
            return false;
        }
    }, [dispatch, navigate]);

    const navigateToSignup = useCallback(() => {
        navigate('/signin');
    }, [navigate]);

    return (
        <AuthPage>
            <AuthCard>
                <AuthHeader>
                    <AuthTitle>Welcome back</AuthTitle>
                    <AuthSubtitle>Please sign in to your account</AuthSubtitle>
                </AuthHeader>
                <LoginForm
                    initialCredentials={initialCredentials}
                    onSubmit={handleSubmit}
                />
                <SecondaryAction>
                    Don&apos;t have an account?
                    <SecondaryLink type="button" onClick={navigateToSignup}>
                        Create one
                    </SecondaryLink>
                </SecondaryAction>
            </AuthCard>
        </AuthPage>
    );
};

export default LoginPage;
