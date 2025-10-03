import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { ContactFormInput } from '../../utils/dataTransformers';
import ContactFormCard from './ContactFormCard';

jest.mock('react-responsive-modal', () => ({
  __esModule: true,
  default: ({ open, children }: { open: boolean; children?: ReactNode }) =>
    open ? <div data-testid="mock-modal">{children}</div> : null
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? '',
    i18n: { language: 'en', changeLanguage: jest.fn(async () => undefined) }
  })
}));

type UserEventInstance = ReturnType<typeof userEvent.setup>;

const fillField = async (user: UserEventInstance, placeholder: string, value: string) => {
  const input = screen.getByPlaceholderText(placeholder);
  await user.clear(input);
  await user.type(input, value);
};

describe('ContactFormCard', () => {
  it('submits valid form and shows success feedback', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(async (_input: ContactFormInput) => undefined);

    render(<ContactFormCard onSubmit={onSubmit} language="en" />);

    await fillField(user, 'Full name *', 'John Doe');
    await fillField(user, 'Phone *', '555-1234');
    await fillField(user, 'Email *', 'john@example.com');
    await fillField(user, 'How can I help? *', 'Hello world');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        phone: '555-1234',
        email: 'john@example.com',
        message: 'Hello world'
      })
    );

    await waitFor(() => expect(screen.getByText('Thank you!')).toBeTruthy());
  });

  it('shows validation message when required fields missing', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(async (_input: ContactFormInput) => undefined);

    render(<ContactFormCard onSubmit={onSubmit} language="en" />);

    const form = screen.getByTestId('contact-form');
    fireEvent.submit(form);

    await waitFor(() => expect(screen.getByText('Please fill in all required fields (*)')).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();

    await fillField(user, 'Full name *', 'Jane Doe');
    await fillField(user, 'Phone *', '555-5678');
    await fillField(user, 'Email *', 'jane@example.com');
    await fillField(user, 'How can I help? *', 'Help needed');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });
});
