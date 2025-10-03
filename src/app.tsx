import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';

import AppRouter from './routers/AppRouter';
import configureStore, { AppDispatch, AppStore } from './store/configureStore';
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

const store: AppStore = configureStore();
const dispatch: AppDispatch = store.dispatch;

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
      dispatch(startGetTableTemplate()),
      dispatch(startGetCategories()),
      dispatch(startGetPoints())
    ]);
  } finally {
    renderApp();
  }
};

void bootstrap();

firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
  const uid = typeof user?.uid === 'string' ? user.uid : null;
  if (uid) {
    dispatch(login(uid));
    return;
  }

  dispatch(logout());
});
