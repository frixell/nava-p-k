import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';

interface MiddlewareOptions {
  thunk?: boolean | { extraArgument: unknown };
  immutableCheck?: boolean | Record<string, unknown>;
  serializableCheck?: boolean | Record<string, unknown>;
  actionCreatorCheck?: boolean | Record<string, unknown>;
}

type DefaultMiddlewareGetter = (options?: MiddlewareOptions) => unknown;

import pointsReducer from './slices/pointsSlice';
import categoriesReducer from './slices/categoriesSlice';
import tableTemplateReducer from './slices/tableTemplateSlice';
import aboutpageReducer from './slices/aboutSlice';
import cvpageReducer from './slices/cvSlice';
import teachingpageReducer from './slices/teachingSlice';
import authReducer from './slices/authSlice';
import homepageReducer from './slices/homepageSlice';

export const createAppStore = () =>
  configureStore({
    reducer: {
      points: pointsReducer,
      categories: categoriesReducer,
      tableTemplate: tableTemplateReducer,
      aboutpage: aboutpageReducer,
      cvpage: cvpageReducer,
      teachingpage: teachingpageReducer,
      auth: authReducer,
      homepage: homepageReducer
    },
    middleware: (getDefaultMiddleware: DefaultMiddlewareGetter) =>
      getDefaultMiddleware({ serializableCheck: false })
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default createAppStore;
