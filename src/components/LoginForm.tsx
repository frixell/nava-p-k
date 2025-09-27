import React, { useState, FormEvent } from 'react';

interface LoginFormProps {
    onSubmit: (user: { userEmail: string; password: string }) => Promise<boolean>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!userEmail || !password) {
            setError('Please provide both email and password.');
            return;
        }

        const success = await onSubmit({ userEmail, password });

        if (!success) {
            setError('Login failed. Please check your credentials.');
        } else {
            setError('');
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="userEmail">Email</label>
                <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="login-button">
                Login
            </button>
        </form>
    );
};

export default LoginForm;