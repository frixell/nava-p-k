import { configureStore } from '@reduxjs/toolkit';

import pointsReducer from './slices/pointsSlice';
import categoriesReducer from './slices/categoriesSlice';
import tableTemplateReducer from './slices/tableTemplateSlice';
import aboutpageReducer from './slices/aboutSlice';
import cvpageReducer from './slices/cvSlice';
import teachingpageReducer from '../reducers/teachingpage';
import authReducer from './slices/authSlice';
import homepageReducer from '../reducers/homepage';
import navigationReducer from '../reducers/navigation';

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
      homepage: homepageReducer,
      navigation: navigationReducer
    },
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({ serializableCheck: false })
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;

export default createAppStore;
