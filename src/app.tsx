import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import 'normalize.css/normalize.css';
import AppRouter from './routers/AppRouter';
import { store } from './store/configureStore';
import { startGetCategories } from './store/slices/categoriesSlice';
import { startGetPoints } from './store/slices/pointsSlice';
import { startGetTableTemplate } from './store/slices/tableTemplateSlice';
import { startSetHomePage } from './store/slices/homepageSlice';
import { login, logout } from './store/slices/authSlice';
import i18n from './i18n/i18n';
import appTheme from './styles/theme';
import LoadingScreen from './components/common/LoadingScreen';
import { firebase } from './firebase/firebase';
import './styles/styles.scss';
import ThemeOverrides from './styles/ThemeOverrides';
import GlobalStyles from './styles/GlobalStyles';

const container = typeof document !== 'undefined' ? document.getElementById('app') : null;
const root: Root | null = container ? createRoot(container) : null;
let hasRendered = false;

const renderApp = () => {
  if (!root || hasRendered) {
    return;
  }

  const jsx = (
    <ThemeProvider theme={appTheme}>
      <ThemeOverrides />
      <GlobalStyles />
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
      <ThemeOverrides />
      <GlobalStyles />
      <LoadingScreen />
    </ThemeProvider>
  );
};

renderLoading();

const bootstrap = async () => {
  try {
    await Promise.all([
      store.dispatch(startGetTableTemplate()),
      store.dispatch(startGetCategories()),
      store.dispatch(startGetPoints()),
      store.dispatch(startSetHomePage())
    ]);
  } finally {
    renderApp();
  }
};

bootstrap().catch((error: unknown) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('Application bootstrap failed', error);
  }
});

firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
  const uid = typeof user?.uid === 'string' ? user.uid : null;
  if (uid) {
    store.dispatch(login(uid));
    return;
  }

  store.dispatch(logout());
});
