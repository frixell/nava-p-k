import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import aboutpageReducer from '../reducers/aboutpage';
import cvpageReducer from '../reducers/cvpage';
import teachingpageReducer from '../reducers/teachingpage';
import authReducer from '../reducers/auth';
import homepageReducer from '../reducers/homepage';
import navigationReducer from '../reducers/navigation';
import pointsReducer from '../reducers/points';
import categoriesReducer from '../reducers/categories';
import tableTemplateReducer from '../reducers/tableTemplate';

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
            cvpage: cvpageReducer,
            teachingpage: teachingpageReducer,
            auth: authReducer,
            homepage: homepageReducer,
            navigation: navigationReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    /* eslint-enable */
    return store;
};