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

interface SigninFormProps {
  initialCredentials?: Credentials;
  onSubmit(credentials: Credentials): Promise<boolean>;
}

const DEFAULT_CREDENTIALS: Credentials = {
  userEmail: '',
  password: ''
};

const SigninForm: React.FC<SigninFormProps> = ({
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
      weakPassword: 'Password must contain at least 6 characters.'
    }),
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const credentials: LoginCredentialsInput = { userEmail, password };
      const validationResult = validateLoginCredentials(credentials, validationMessages);

      if (!validationResult.isValid) {
        setError(validationResult.message);
        return;
      }

      setError('');
      setConnecting(true);

      try {
        const success = await onSubmit(validationResult.value);
        if (!success) {
          setError('Please provide valid user name and password');
        }
      } catch (submitError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Sign-in submission failed', submitError);
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
          <Spinner role="status" aria-label="Creating your account" />
          <p>Creating your account...</p>
        </SpinnerWrapper>
      ) : (
        <AuthForm onSubmit={handleSubmit} noValidate>
          <Input
            label="Email Address"
            id="signin-email"
            type="email"
            autoFocus
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            id="signin-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <SubmitButton type="submit" disableElevation disabled={connecting}>
            Create Account
          </SubmitButton>
        </AuthForm>
      )}
    </>
  );
};

export default SigninForm;
