import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Input from '../shared/components/Input';
import PasswordInput from '../shared/components/PasswordInput';
import { validateLoginCredentials } from '../utils/validation';
import type { LoginCredentialsInput } from '../utils/dataTransformers';
import {
  AuthForm,
  ErrorBanner,
  ErrorIcon,
  Spinner,
  SpinnerWrapper,
  SubmitButton
} from './auth/AuthStyles';

interface Credentials {
  userEmail: string;
  password: string;
}

interface LoginFormProps {
  initialCredentials?: Credentials;
  onSubmit(credentials: Credentials): Promise<boolean>;
}

const DEFAULT_CREDENTIALS: Credentials = {
  userEmail: '',
  password: ''
};

const LoginForm: React.FC<LoginFormProps> = ({
  initialCredentials = DEFAULT_CREDENTIALS,
  onSubmit
}) => {
  const [userEmail, setUserEmail] = useState(initialCredentials.userEmail);
  const [password, setPassword] = useState(initialCredentials.password);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setUserEmail(initialCredentials.userEmail);
    setPassword(initialCredentials.password);
  }, [initialCredentials]);

  const validationMessages = useMemo(
    () => ({
      invalidCredentials: 'Please provide user email and password',
      invalidEmail: 'Please provide a valid email address',
      weakPassword: 'Password should be at least 6 characters.'
    }),
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const credentials: LoginCredentialsInput = { userEmail, password };
      const validation = validateLoginCredentials(credentials, validationMessages);

      if (!validation.isValid) {
        setError(validation.message);
        return;
      }

      setError('');
      setConnecting(true);

      try {
        const success = await onSubmit(validation.value);
        if (!success) {
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
    },
    [userEmail, password, onSubmit, validationMessages]
  );

  return (
    <>
      {error && (
        <ErrorBanner role="alert">
          <ErrorIcon aria-hidden>⚠️</ErrorIcon>
          {error}
        </ErrorBanner>
      )}

      {connecting ? (
        <SpinnerWrapper>
          <Spinner role="status" aria-label="Signing you in" />
          <p>Signing you in...</p>
        </SpinnerWrapper>
      ) : (
        <AuthForm onSubmit={handleSubmit} noValidate>
          <Input
            label="Email Address"
            id="login-email"
            type="email"
            autoFocus
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            id="login-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <SubmitButton type="submit" disableElevation disabled={connecting}>
            Sign In
          </SubmitButton>
        </AuthForm>
      )}
    </>
  );
};

export default LoginForm;
