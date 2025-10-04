import { combineReducers } from 'redux';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from './slices/pointsSlice';
import categoriesReducer from './slices/categoriesSlice';
import tableTemplateReducer from './slices/tableTemplateSlice';
import aboutpageReducer from './slices/aboutSlice';
import cvpageReducer from './slices/cvSlice';
import teachingpageReducer from './slices/teachingSlice';
import authReducer from './slices/authSlice';
import homepageReducer from './slices/homepageSlice';

const reducers = {
  points: pointsReducer,
  categories: categoriesReducer,
  tableTemplate: tableTemplateReducer,
  aboutpage: aboutpageReducer,
  cvpage: cvpageReducer,
  teachingpage: teachingpageReducer,
  auth: authReducer,
  homepage: homepageReducer
};

export const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof rootReducer>;

type StorePreloadedState = Partial<RootState>;

const buildStore = (preloadedState?: StorePreloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });

export const store = buildStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

export const createAppStore = (preloadedState?: StorePreloadedState): AppStore =>
  buildStore(preloadedState);

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default createAppStore;
