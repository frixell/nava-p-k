import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import ReactLoading from "react-loading";
import I18n from "redux-i18n";
import firebase from "firebase/app";
import "firebase/auth";

import AppRouter from './routers/AppRouter';
import { store, AppDispatch } from './store/configureStore';
import { fetchTableTemplate } from './reducers/tableTemplate';
import { fetchPoints } from './reducers/points';
import { fetchCategories } from './reducers/categories';
import { login, logout } from './reducers/auth';
import { translations } from "./translations";

import 'normalize.css/normalize.css';
import './styles/styles.scss';

interface IpApiResponse {
  country: string;
}

const getInitialLang = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json');
    if (!response.ok) {
      console.warn(`IP lookup failed with status: ${response.status}`);
      return 'en';
    }
    const data: IpApiResponse = await response.json();
    // Default to 'en' even if country is 'IL' as per original logic
    return data.country === 'IL' ? 'en' : 'en';
  } catch (error) {
    console.error('Request to ipapi.co failed.', error);
    return 'en'; // Default to 'en' on network error
  }
};

const fetchInitialData = async (): Promise<void> => {
  // Using AppDispatch to ensure type safety with thunks
  const dispatch = store.dispatch as AppDispatch;
  await dispatch(fetchTableTemplate());
  await dispatch(fetchCategories());
  await dispatch(fetchPoints());
};

const renderApp = (root: Root, initialLang: string): void => {
  const jsx = (
    <Provider store={store}>
      <I18n translations={translations} initialLang={initialLang} fallbackLang="en">
        <AppRouter />
      </I18n>
    </Provider>
  );
  // Use the existing root to render the main application
  root.render(jsx);
};

const startApp = async (): Promise<void> => {
  const container = document.getElementById('app');
  if (!container) {
    console.error("Root element #app not found in the document.");
    return;
  }

  const root: Root = createRoot(container);

  // Check for legacy IE and show a specific message if needed
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('msie ') || ua.includes('trident/')) {
    root.render(
      <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
        <img src="/images/ie-preloader.gif" alt="זיוה קיינר - ציירת - עין הוד"/>
      </div>
    );
    return; // Stop execution for unsupported browsers
  }

  // Show a generic loading spinner
  root.render(
    <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <ReactLoading type="spinningBubbles" color="#666665" />
    </div>
  );

  // Perform all startup tasks concurrently
  try {
    const [initialLang] = await Promise.all([
      getInitialLang(),
      fetchInitialData()
    ]);
    
    // Once all data is ready, render the main application
    renderApp(root, initialLang);
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    // Optionally render an error message to the user
    root.render(<div>Sorry, something went wrong while loading the application.</div>);
  }
};

// Set up Firebase authentication listener
firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
  if (user) {
    (store.dispatch as AppDispatch)(login(user.uid));
  } else {
    (store.dispatch as AppDispatch)(logout());
  }
});

// Kick off the application
startApp();