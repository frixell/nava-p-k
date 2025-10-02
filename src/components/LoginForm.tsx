// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import Input from '../shared/components/Input';
import Button from '../shared/components/Button';
import PasswordInput from '../shared/components/PasswordInput';
import { validateLoginCredentials } from '../utils/validation';
import { LoginCredentialsInput } from '../utils/dataTransformers';

interface LoginFormProps {
    user: { userEmail: string; password: string };
    onSubmit: (user: { userEmail: string; password: string }) => Promise<boolean>;
}

const LoginForm: React.FC<LoginFormProps> = ({ user, onSubmit }) => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        setUserEmail(user.userEmail);
        setPassword(user.password);
    }, [user]);

    const onUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const credentials: LoginCredentialsInput = { userEmail, password };
        const validation = validateLoginCredentials(credentials, {
            invalidCredentials: 'Please provide user email and password',
            invalidEmail: 'Please provide a valid email address',
            weakPassword: 'Password should be at least 6 characters.'
        });

        if (!validation.isValid) {
            setError(validation.message);
            return;
        }

        setError('');
        setConnecting(true);

        try {
            const success = await onSubmit(validation.value);
            if (success === false) {
                setError('Please provide valid user name and password');
            }
        } catch (submitError) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Login submission failed', submitError);
            }
            setError('Unable to sign in right now. Please try again later.');
        } finally {
            setConnecting(false);
        }
    }, [userEmail, password, onSubmit]);

    return (
        <div className="login-form">
            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}
            {connecting ? (
                <div className="connecting-state">
                    <div className="spinner"></div>
                    <p>Signing you in...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="login-form-inputs">
                    <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        autoFocus
                        value={userEmail}
                        onChange={onUserEmailChange}
                    />
                    <PasswordInput
                        label="Password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={onPasswordChange}
                    />
                    <Button type="submit" className="login-button">
                        Sign In
                    </Button>
                </form>
            )}
        </div>
    );
};

export default LoginForm;
