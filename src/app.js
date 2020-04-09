import React from 'react';
import { render } from 'react-dom';
import ReactLoading from "react-loading";
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import {
    startSetCategories,
    startSetAllSubcategories,
    startSetAllEvents
} from './actions/eventspage';
import {
    startGetPoints
} from './actions/points';
import {
    startSetCostumers
} from './actions/costumers';
import {
    startSetDesktopGallery
} from './actions/desktopGallery';
import {
    startSetMobileGallery
} from './actions/mobileGallery';
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
              initialLang = 'he';
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




//   get geolocation if needed  -----------------------------------

// var options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0
// };

// function success(pos) {
//   var crd = pos.coords;

//   console.log('Your current position is:');
//   console.log(`Latitude : ${crd.latitude}`);
//   console.log(`Longitude: ${crd.longitude}`);
//   console.log(`More or less ${crd.accuracy} meters.`);
// }

// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }

// navigator.geolocation.getCurrentPosition(success, error, options);

//  ---------------------------------------------------------------------------------







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
            render(jsx, document.getElementById('app'));
        }
        hasRendered = true;
    }
};

//console.log(navigator.userAgent);
if (typeof(window) !== "undefined") {
    if (navigator.userAgent.toLowerCase().indexOf('msie') > -1 || navigator.userAgent.toLowerCase().indexOf('trident') > -1 || navigator.userAgent.toLowerCase().indexOf('edge') > -1 ){
        console.log("found");
        render(<div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><img src="/images/ie-preloader.gif" alt="זיוה קיינר - ציירת - עין הוד"/></div>, document.getElementById('app'));
    } else {
        render(<div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><ReactLoading type="spinningBubbles" color="#666665" /></div>, document.getElementById('app'));
    }
}

store.dispatch(startGetPoints()).then(() => {
    store.dispatch(startSetCategories()).then(() => {
        store.dispatch(startSetDesktopGallery()).then(() => {
            store.dispatch(startSetMobileGallery()).then(() => {
                store.dispatch(startSetCostumers()).then(() => {
                    renderApp();
                });
            });
        });
    });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        store.dispatch(login(user.uid));
        store.dispatch(startSetAllSubcategories()).then(() => {
            store.dispatch(startSetAllEvents());
        });
    } else {
        store.dispatch(logout());
    }
});