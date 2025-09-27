import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactLoading from "react-loading";
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
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

import I18n from "redux-i18n";

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
const renderApp = () => {
    //console.log(initialLang);
    if (!hasRendered && initialLang !== 'none') {
        const jsx = (
            <Provider store={store}>
                <I18n translations={translations} initialLang={initialLang} fallbackLang="en">
                    <AppRouter />
                </I18n>
            </Provider>
        );
        if (typeof(window) !== "undefined") {
            const container = document.getElementById('app');
            const root = createRoot(container);
            root.render(jsx);
        }
        hasRendered = true;
    }
};

//console.log(navigator.userAgent);
if (typeof(window) !== "undefined") {
    const container = document.getElementById('app');
    const root = createRoot(container);

    if (navigator.userAgent.toLowerCase().indexOf('msie') > -1 || navigator.userAgent.toLowerCase().indexOf('trident') > -1 || navigator.userAgent.toLowerCase().indexOf('edge') > -1 ){
        console.log("found");
        root.render(<div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><img src="/images/ie-preloader.gif" alt="זיוה קיינר - ציירת - עין הוד"/></div>);
    } else {
        root.render(<div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><ReactLoading type="spinningBubbles" color="#666665" /></div>);
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