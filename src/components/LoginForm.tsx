import React, { useState, useCallback, useEffect } from 'react';
import Input from '../shared/components/Input';
import Button from '../shared/components/Button';
import PasswordInput from '../shared/components/PasswordInput';

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

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!userEmail || !password) {
            setError('Please provide user email and password');
            return;
        }
        setError('');
        setConnecting(true);

        onSubmit({ userEmail, password })
            .then((res) => {
                if (res === false) {
                    setError('Please provide valid user name and password');
                    setConnecting(false);
                }
            });
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