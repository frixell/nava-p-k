import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';

import AppRouter from './routers/AppRouter';
import configureStore, { AppDispatch } from './store/configureStore';
import { startGetCategories } from './store/slices/categoriesSlice';
import { startGetPoints } from './store/slices/pointsSlice';
import { startGetTableTemplate } from './store/slices/tableTemplateSlice';
import { login, logout } from './store/slices/authSlice';
import i18n from './i18n/i18n';
import appTheme from './styles/theme';
import LoadingScreen from './components/common/LoadingScreen';
import { firebase } from './firebase/firebase';

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  require('normalize.css/normalize.css');
}
import './styles/styles.scss';

const store = configureStore();
const dispatch = store.dispatch as AppDispatch;

const container = typeof document !== 'undefined' ? document.getElementById('app') : null;
const root: Root | null = container ? createRoot(container) : null;
let hasRendered = false;

const renderApp = () => {
  if (!root || hasRendered) {
    return;
  }

  const jsx = (
    <ThemeProvider theme={appTheme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <HelmetProvider>
            <AppRouter />
          </HelmetProvider>
        </I18nextProvider>
      </Provider>
    </ThemeProvider>
  );

  root.render(jsx);
  hasRendered = true;
};

const renderLoading = () => {
  if (!root || hasRendered) {
    return;
  }

  root.render(
    <ThemeProvider theme={appTheme}>
      <LoadingScreen />
    </ThemeProvider>
  );
};

renderLoading();

const bootstrap = async () => {
  try {
    await Promise.all([
      dispatch(startGetTableTemplate() as any),
      dispatch(startGetCategories() as any),
      dispatch(startGetPoints() as any)
    ]);
  } finally {
    renderApp();
  }
};

bootstrap();

firebase.auth().onAuthStateChanged((user: any) => {
  if (user) {
    dispatch(login(user.uid) as any);
  } else {
    dispatch(logout() as any);
  }
});
