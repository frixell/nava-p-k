import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { HelmetProvider } from 'react-helmet-async';
import { http, HttpResponse } from 'msw';

import TeachingPage from '../TeachingPage';
import createAppStore, { AppStore } from '../../store/configureStore';
import appTheme from '../../styles/theme';
import { login } from '../../store/slices/authSlice';
import { server } from '../../tests/msw/server';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue?: string) => defaultValue ?? _key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(async () => undefined)
    }
  })
}));

jest.mock('../../firebase/firebase');

const firebaseModule = jest.requireMock('../../firebase/firebase') as {
  __resetMockFirebase: (initial?: Record<string, unknown>) => void;
  __getMockFirebaseState: () => Record<string, any>;
};
const { __resetMockFirebase, __getMockFirebaseState } = firebaseModule;

const renderTeachingPage = (store: AppStore) =>
  render(
    <HelmetProvider>
      <ThemeProvider theme={appTheme}>
        <MemoryRouter initialEntries={['/Teaching']}>
          <Provider store={store}>
            <TeachingPage />
          </Provider>
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>
  );

describe('TeachingPage smoke flow', () => {
  beforeEach(() => {
    __resetMockFirebase({
      website: {
        teachingpage: {
          teachings: {
            'teach-1': {
              id: 'teach-1',
              details: '<p>Detail</p>',
              description: '<p>Description</p>',
              order: 1,
              visible: true,
              publicId: 'public-1'
            }
          },
          seo: {
            title: 'Teaching',
            description: 'Teaching description',
            keyWords: 'teaching'
          }
        }
      }
    });
  });

  it('hides and deletes a teaching item while calling the backing endpoints', async () => {
    const deleteImageSpy = jest.fn();
    server.use(
      http.post('/deleteImage', async ({ request }) => {
        deleteImageSpy(await request.text());
        return HttpResponse.json({ ok: true });
      })
    );

    const store = createAppStore();
    store.dispatch(login('test-user'));

    renderTeachingPage(store);

    const card = await screen.findByTestId('teach-card-teach-1');

    fireEvent.mouseEnter(card);

    const hideButton = await screen.findByRole('button', { name: /hide teaching item/i });
    await userEvent.click(hideButton);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /show teaching item/i })).toBeTruthy()
    );

    fireEvent.mouseEnter(card);
    const deleteButton = screen.getByRole('button', { name: /delete teaching item/i });
    await userEvent.click(deleteButton);

    await waitFor(() => expect(screen.queryByTestId('teach-card-teach-1')).toBeNull());

    expect(deleteImageSpy).toHaveBeenCalledTimes(1);
    expect(deleteImageSpy.mock.calls[0]?.[0]).toContain('public-1');

    const state = __getMockFirebaseState() as {
      website?: { teachingpage?: { teachings?: Record<string, unknown> } };
    };
    const teachingsState = Object.keys(state.website?.teachingpage?.teachings ?? {});
    expect(teachingsState).toEqual([]);
  });
});
