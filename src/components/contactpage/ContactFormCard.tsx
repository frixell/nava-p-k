import React, { FormEvent, useMemo, useState } from 'react';
import Modal from 'react-responsive-modal';
import {
  Card,
  CardHeading,
  CardSubheading,
  FieldStack,
  InputField,
  TextAreaField,
  PrimaryButton,
  ErrorMessage,
  SuccessContent,
  SuccessTitle,
  SuccessBody
} from './ContactPage.styles';
import { validateContactForm } from '../../utils/validation';
import type { ContactFormInput } from '../../utils/dataTransformers';
import { useTranslation } from 'react-i18next';

interface ContactFormCardProps {
  onSubmit(input: ContactFormInput): Promise<void> | void;
  language: string;
}

const emptyForm: ContactFormInput = {
  name: '',
  phone: '',
  email: '',
  message: ''
};

const ContactFormCard: React.FC<ContactFormCardProps> = ({ onSubmit, language }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactFormInput>(emptyForm);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);

  const dir: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';

  const validationMessages = useMemo(
    () => ({
      missingRequired: t('contact.errors.missingRequired', 'Please fill in all required fields (*)'),
      invalidEmail: t('contact.errors.invalidEmail', 'Please enter a valid email address.'),
      invalidMessage: t('contact.errors.invalidMessage', 'Please share a short message so I know how to help.')
    }),
    [t]
  );

  const handleChange = (field: keyof ContactFormInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const validation = validateContactForm(form, validationMessages);

    if (!validation.isValid) {
      setError(validation.message ?? validationMessages.missingRequired);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({ ...validation.value, createdAt: Date.now() });
      setSuccessOpen(true);
      setForm(emptyForm);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to submit contact message', err);
      }
      setError(t('contact.errors.submitFailed', 'Something went wrong while sending your message. Please try again later.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeading>{t('contact.form.title', 'Let’s talk')}</CardHeading>
      <CardSubheading>{t('contact.form.subtitle', 'Leave your details and I’ll get back to you soon.')}</CardSubheading>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <form onSubmit={handleSubmit} dir={dir}>
        <FieldStack>
          <InputField
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder={t('namePlaceholder', 'Full name *')}
            required
          />
          <InputField
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder={t('phonePlaceholder', 'Phone *')}
            required
          />
          <InputField
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder={t('emailPlaceholder', 'Email *')}
            required
          />
          <TextAreaField
            value={form.message}
            onChange={handleChange('message')}
            placeholder={t('messagePlaceholder', 'How can I help? *')}
            required
          />
        </FieldStack>
        <PrimaryButton type="submit" disabled={isSubmitting} style={{ marginTop: '1.6rem' }}>
          {isSubmitting ? t('contact.form.sending', 'Sending…') : t('sendMessage', 'Send message')}
        </PrimaryButton>
      </form>

      <Modal open={isSuccessOpen} onClose={() => setSuccessOpen(false)} center>
        <SuccessContent>
          <SuccessTitle>{t('contact.form.successTitle', 'Thank you!')}</SuccessTitle>
          <SuccessBody>{t('contact.form.successBody', 'I will reach out as soon as possible.')}</SuccessBody>
          <PrimaryButton type="button" onClick={() => setSuccessOpen(false)}>
            {t('contact.form.successButton', 'Close')}
          </PrimaryButton>
        </SuccessContent>
      </Modal>
    </Card>
  );
};

export default ContactFormCard;
