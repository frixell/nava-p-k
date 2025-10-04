import type { AnyAction, Middleware } from 'redux';
import { combineReducers } from 'redux';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import type { PointsState } from './slices/pointsSlice';
import type { CategoriesState } from './slices/categoriesSlice';
import type { TableTemplateState } from './slices/tableTemplateSlice';
import type { AboutPageState } from './slices/aboutSlice';
import type { CvPageState } from './slices/cvSlice';
import type { TeachingPageState } from './slices/teachingSlice';
import type { AuthState } from './slices/authSlice';
import type { HomepageState } from './slices/homepageSlice';

interface MiddlewareOptions {
  thunk?: boolean | { extraArgument: unknown };
  immutableCheck?: boolean | Record<string, unknown>;
  serializableCheck?: boolean | Record<string, unknown>;
  actionCreatorCheck?: boolean | Record<string, unknown>;
}

type DefaultMiddlewareGetter = (options?: MiddlewareOptions) => Middleware[];

import pointsReducer from './slices/pointsSlice';
import categoriesReducer from './slices/categoriesSlice';
import tableTemplateReducer from './slices/tableTemplateSlice';
import aboutpageReducer from './slices/aboutSlice';
import cvpageReducer from './slices/cvSlice';
import teachingpageReducer from './slices/teachingSlice';
import authReducer from './slices/authSlice';
import homepageReducer from './slices/homepageSlice';

export interface RootState {
  points: PointsState;
  categories: CategoriesState;
  tableTemplate: TableTemplateState;
  aboutpage: AboutPageState;
  cvpage: CvPageState;
  teachingpage: TeachingPageState;
  auth: AuthState;
  homepage: HomepageState;
}

const rootReducer = combineReducers<RootState>({
  points: pointsReducer,
  categories: categoriesReducer,
  tableTemplate: tableTemplateReducer,
  aboutpage: aboutpageReducer,
  cvpage: cvpageReducer,
  teachingpage: teachingpageReducer,
  auth: authReducer,
  homepage: homepageReducer
});

export const createAppStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware: DefaultMiddlewareGetter) =>
      getDefaultMiddleware({ serializableCheck: false })
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default createAppStore;
