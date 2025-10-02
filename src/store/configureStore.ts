import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import pointsReducer from '../reducers/points';
import categoriesReducer from '../reducers/categories';
import tableTemplateReducer from '../reducers/tableTemplate';
import aboutpageReducer from '../reducers/aboutpage';
import cvpageReducer from '../reducers/cvpage';
import teachingpageReducer from '../reducers/teachingpage';
import authReducer from '../reducers/auth';
import homepageReducer from '../reducers/homepage';
import navigationReducer from '../reducers/navigation';

const rootReducer = combineReducers({
  points: pointsReducer,
  categories: categoriesReducer,
  tableTemplate: tableTemplateReducer,
  aboutpage: aboutpageReducer,
  cvpage: cvpageReducer,
  teachingpage: teachingpageReducer,
  auth: authReducer,
  homepage: homepageReducer,
  navigation: navigationReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const composeEnhancers =
  (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const createAppStore = () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];

export default createAppStore;
