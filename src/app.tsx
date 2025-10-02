import { createRoot, Root } from 'react-dom/client';
import ReactLoading from 'react-loading';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';

import AppRouter from './routers/AppRouter';
import configureStore, { AppDispatch } from './store/configureStore';
import { startSetCategories } from './actions/eventspage';
import { startGetCategories } from './actions/categories';
import { startGetPoints } from './actions/points';
import { startGetTableTemplate } from './actions/tableTemplate';
import { login, logout } from './actions/auth';
import i18n from './i18n/i18n';
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
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider>
          <AppRouter />
        </HelmetProvider>
      </I18nextProvider>
    </Provider>
  );

  root.render(jsx);
  hasRendered = true;
};

const renderLoading = () => {
  if (!root || hasRendered) {
    return;
  }

  root.render(
    <div className="app__loading-screen">
      <div className="app__loading-spinner">
        <ReactLoading type="spinningBubbles" color="#666665" />
        <p>Loading portfolio…</p>
      </div>
    </div>
  );
};

renderLoading();

const bootstrap = async () => {
  try {
    await dispatch(startGetTableTemplate() as any);
    await dispatch(startGetCategories() as any);
    await dispatch(startGetPoints() as any);
    await dispatch(startSetCategories() as any);
  } finally {
    renderApp();
  }
};

bootstrap();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    dispatch(login(user.uid) as any);
  } else {
    dispatch(logout() as any);
  }
});
