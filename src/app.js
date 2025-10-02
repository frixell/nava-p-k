import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactLoading from "react-loading";
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { HelmetProvider } from 'react-helmet-async';
import {
    startSetCategories
} from './actions/eventspage';
import { startGetCategories } from './actions/categories';
import {
    startGetPoints
} from './actions/points';
import {
    startGetTableTemplate
} from './actions/tableTemplate';

import { login, logout } from './actions/auth';
if (typeof(window) !== "undefined") {
    //import 'normalize.css/normalize.css';
    require("normalize.css/normalize.css");
}
import './styles/styles.scss';
//import { firebase } from './firebase/firebase';
var firebase = require("firebase/app");
require("firebase/auth");

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';

// with Immutable.js:
//import I18n from "redux-i18n/immutable"

import {translations} from "./translations";

// const currentLocale = I18n.currentLocale();

// // Is it a RTL language?
// export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;
// console.log('is rtl');
// console.log(isRTL);


import $ from 'jquery';


// import ReactGA from 'react-ga';

// function initializeReactGA() {
//     ReactGA.initialize('UA-128960221-1');
//     ReactGA.pageview('/homepage');
// }
// //initializeReactGA();


let initialLang = 'none';

function ipLookUp () {
  $.ajax('https://ipapi.co/json')
  .then(
      function success(response) {
          //console.log('User\'s Location Data is ', response);
          //console.log('User\'s Country', response.country);
          //console.log(navigator.languages)
          if (response.country === 'IL') {
              initialLang = 'en';
          } else {
              initialLang = 'en';
          }
      },

      function fail(data, status) {
          console.log('Request failed.  Returned status of',
                      status);
      }
  );
}
ipLookUp();


const store = configureStore();
// initialLang="he" fallbackLang="en"


let hasRendered = false;
let root;

if (typeof document !== 'undefined') {
    const container = document.getElementById('app');
    if (container) {
        root = createRoot(container);
    }
}

const renderApp = () => {
    //console.log(initialLang);
    if (!hasRendered && initialLang !== 'none') {
        const jsx = (
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <HelmetProvider>
                        <AppRouter />
                    </HelmetProvider>
                </I18nextProvider>
            </Provider>
        );
        if (root) {
            root.render(jsx);
        }
        hasRendered = true;
    }
};

//console.log(navigator.userAgent);
if (root && typeof(window) !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    const isLegacyIE = userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1 || userAgent.indexOf('edge') > -1;

    if (isLegacyIE) {
        console.log("found");
        root.render(
            <div className="app__loading-screen">
                <img src="/images/ie-preloader.gif" alt="זיוה קיינר - ציירת - עין הוד" />
            </div>
        );
    } else {
        root.render(
            <div className="app__loading-screen">
                <div className="app__loading-spinner">
                    <ReactLoading type="spinningBubbles" color="#666665" />
                    <p>Loading portfolio…</p>
                </div>
            </div>
        );
    }
}

store.dispatch(startGetTableTemplate()).then(() => {
    store.dispatch(startGetCategories()).then(() => {
        store.dispatch(startGetPoints()).then(() => {
            store.dispatch(startSetCategories()).then(() => {
                renderApp();
            });
        });
    });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        store.dispatch(login(user.uid));
        
    } else {
        store.dispatch(logout());
    }
});
