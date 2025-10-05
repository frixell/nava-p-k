export interface NewsletterFormData {
  name: string;
  email: string;
}

export interface NewsletterRecord {
  name: string;
  email: string;
}

export interface NewsletterApiPayload {
  firstName: string;
  email: string;
  lists_ToSubscribe: string[];
}

export interface ContactFormInput {
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt?: number | Date;
}

export interface ContactMessageRecord {
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: number;
}

export interface LoginCredentialsInput {
  userEmail: string;
  password: string;
}

export interface LoginCredentialsRecord {
  userEmail: string;
  password: string;
}

export const sanitizeText = (value: string): string => value.trim();

export const normalizeEmail = (value: string): string => sanitizeText(value).toLowerCase();

export const createNewsletterRecord = (data: NewsletterFormData): NewsletterRecord => ({
  name: sanitizeText(data.name),
  email: normalizeEmail(data.email)
});

export const createNewsletterApiPayload = (
  data: NewsletterFormData,
  listId: string
): NewsletterApiPayload => ({
  firstName: sanitizeText(data.name),
  email: normalizeEmail(data.email),
  lists_ToSubscribe: [listId]
});

export const createContactMessageRecord = (data: ContactFormInput): ContactMessageRecord => ({
  name: sanitizeText(data.name),
  phone: sanitizeText(data.phone),
  email: normalizeEmail(data.email),
  message: sanitizeText(data.message),
  createdAt:
    data.createdAt instanceof Date ? data.createdAt.getTime() : (data.createdAt ?? Date.now())
});

export const createLoginCredentialsRecord = (
  credentials: LoginCredentialsInput
): LoginCredentialsRecord => ({
  userEmail: normalizeEmail(credentials.userEmail),
  password: sanitizeText(credentials.password)
});
