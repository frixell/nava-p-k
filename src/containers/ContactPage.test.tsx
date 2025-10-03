import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { HelmetProvider } from 'react-helmet-async';
import { http, HttpResponse } from 'msw';

import ContactPage from './ContactPage';
import appTheme from '../styles/theme';
import { server } from '../tests/msw/server';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue?: string) => defaultValue ?? _key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(async () => undefined)
    }
  })
}));

jest.mock('../firebase/firebase');

const firebaseModule = jest.requireMock('../firebase/firebase') as {
  __resetMockFirebase: (initial?: Record<string, unknown>) => void;
  __getMockFirebaseState: () => Record<string, any>;
};
const { __resetMockFirebase, __getMockFirebaseState } = firebaseModule;

describe('ContactPage', () => {
  beforeEach(() => {
    __resetMockFirebase();
  });

  it('submits a contact request and records the message', async () => {
    const sendEmailSpy = jest.fn();
    server.use(
      http.post('/sendEmail', async ({ request }) => {
        const body = await request.text();
        sendEmailSpy(body);
        return HttpResponse.json({ ok: true });
      })
    );

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <ThemeProvider theme={appTheme}>
          <MemoryRouter initialEntries={['/Contact']}>
            <ContactPage />
          </MemoryRouter>
        </ThemeProvider>
      </HelmetProvider>
    );

    await user.type(screen.getByPlaceholderText('Full name *'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Phone *'), '555-1234');
    await user.type(screen.getByPlaceholderText('Email *'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('How can I help? *'), 'Testing contact flow');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByText('Thank you!')).toBeTruthy());

    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
    const requestBody = String(sendEmailSpy.mock.calls[0]?.[0] ?? '');
    const params = new URLSearchParams(requestBody);
    expect(params.get('email')).toBe('john@example.com');
    expect(params.get('name')).toBe('John Doe');

    const state = __getMockFirebaseState();
    const messages = state.messages ?? {};
    const messageRecords = Object.values(messages);
    expect(messageRecords).toHaveLength(1);
    expect(messageRecords[0]).toEqual(
      expect.objectContaining({
        email: 'john@example.com',
        name: 'John Doe',
        message: 'Testing contact flow'
      })
    );
  });
});
