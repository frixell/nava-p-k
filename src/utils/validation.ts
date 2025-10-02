// @ts-nocheck
import {
    ContactFormInput,
    LoginCredentialsInput,
    LoginCredentialsRecord,
    NewsletterFormData,
    createLoginCredentialsRecord,
    createNewsletterRecord,
    sanitizeText,
    normalizeEmail
} from './dataTransformers';

export type ValidationErrorKey =
    | 'missingRequired'
    | 'invalidEmail'
    | 'invalidCredentials'
    | 'weakPassword';

export interface ValidationFailure {
    isValid: false;
    errorKey: ValidationErrorKey;
    message: string;
    missingFields?: string[];
}

export interface ValidationSuccess<T> {
    isValid: true;
    value: T;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface ValidationMessages {
    missingRequired: string;
    invalidEmail: string;
    invalidCredentials?: string;
    weakPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultMessages: ValidationMessages = {
    missingRequired: 'Please fill in all required fields.',
    invalidEmail: 'Please provide a valid email address.',
    invalidCredentials: 'Please provide your email address and password.',
    weakPassword: 'Password must contain at least 6 characters.'
};

const buildFailure = (
    errorKey: ValidationErrorKey,
    message: string,
    missingFields?: string[]
): ValidationFailure => ({
    isValid: false,
    errorKey,
    message,
    missingFields
});

export const isEmailValid = (value: string): boolean => EMAIL_REGEX.test(normalizeEmail(value));

export const findMissingFields = (fields: Record<string, string>): string[] => {
    return Object.entries(fields)
        .filter(([, value]) => !sanitizeText(value))
        .map(([key]) => key);
};

export const validateNewsletterForm = (
    data: NewsletterFormData,
    messages: Partial<ValidationMessages> = {}
): ValidationResult<NewsletterFormData> => {
    const mergedMessages = { ...defaultMessages, ...messages };
    const missingFields = findMissingFields({ name: data.name, email: data.email });

    if (missingFields.length > 0) {
        return buildFailure('missingRequired', mergedMessages.missingRequired, missingFields);
    }

    if (!isEmailValid(data.email)) {
        return buildFailure('invalidEmail', mergedMessages.invalidEmail);
    }

    return {
        isValid: true,
        value: createNewsletterRecord(data)
    };
};

export const validateContactForm = (
    data: ContactFormInput,
    messages: Partial<ValidationMessages> = {}
): ValidationResult<ContactFormInput> => {
    const mergedMessages = { ...defaultMessages, ...messages };
    const missingFields = findMissingFields({
        name: data.name,
        phone: data.phone,
        email: data.email
    });

    if (missingFields.length > 0) {
        return buildFailure('missingRequired', mergedMessages.missingRequired, missingFields);
    }

    if (!isEmailValid(data.email)) {
        return buildFailure('invalidEmail', mergedMessages.invalidEmail);
    }

    return {
        isValid: true,
        value: {
            ...data,
            name: sanitizeText(data.name),
            phone: sanitizeText(data.phone),
            email: normalizeEmail(data.email),
            message: sanitizeText(data.message)
        }
    };
};

export const validateLoginCredentials = (
    data: LoginCredentialsInput,
    messages: Partial<ValidationMessages> = {}
): ValidationResult<LoginCredentialsRecord> => {
    const mergedMessages = { ...defaultMessages, ...messages };
    const missingFields = findMissingFields({
        email: data.userEmail,
        password: data.password
    });

    if (missingFields.length > 0) {
        return buildFailure('invalidCredentials', mergedMessages.invalidCredentials ?? mergedMessages.missingRequired, missingFields);
    }

    if (!isEmailValid(data.userEmail)) {
        return buildFailure('invalidEmail', mergedMessages.invalidEmail);
    }

    if ((sanitizeText(data.password)).length < 6) {
        return buildFailure('weakPassword', mergedMessages.weakPassword ?? defaultMessages.weakPassword);
    }

    return {
        isValid: true,
        value: createLoginCredentialsRecord(data)
    };
};
