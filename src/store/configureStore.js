import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import aboutpageReducer from '../reducers/aboutpage';
import workshoppageReducer from '../reducers/workshoppage';
import authReducer from '../reducers/auth';
import costumersReducer from '../reducers/costumers';
import eventspageReducer from '../reducers/eventspage';
import homepageReducer from '../reducers/homepage';
import navigationReducer from '../reducers/navigation';
import newsletterReducer from '../reducers/newsletter';
import messagesReducer from '../reducers/messages';
import desktopGalleryReducer from '../reducers/desktopGallery';
import mobileGalleryReducer from '../reducers/mobileGallery';
import pointsReducer from '../reducers/points';
import categoriesReducer from '../reducers/categories';
import tableTemplateReducer from '../reducers/tableTemplate';
import {i18nState} from "redux-i18n";

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENTION_COMPOSE__ || compose;

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

export default () => {
    /* eslint-disable no-underscore-dangle */
    const store = createStore(
        combineReducers({
            points: pointsReducer,
            categories: categoriesReducer,
            tableTemplate: tableTemplateReducer,
            aboutpage: aboutpageReducer,
            auth: authReducer,
            costumers: costumersReducer,
            eventspage: eventspageReducer,
            homepage: homepageReducer,
            messages: messagesReducer,
            navigation: navigationReducer,
            newsletter: newsletterReducer,
            workshoppage: workshoppageReducer,
            desktopGallery: desktopGalleryReducer,
            mobileGallery: mobileGalleryReducer,
            i18nState
        }),
        composeEnhancers(applyMiddleware(thunk))
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    /* eslint-enable */
    return store;
};