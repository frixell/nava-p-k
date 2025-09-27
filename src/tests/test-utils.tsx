import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers, EnhancedStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { i18nState } from 'redux-i18n';

import type { RootState, AppDispatch } from '../store/configureStore';
// Import all of your application's reducers
import navigationReducer from '../reducers/navigation';
import aboutpageReducer from '../reducers/aboutpage';
import cvpageReducer from '../reducers/cvpage';
import eventspageReducer from '../reducers/eventspage';
import teachingpageReducer from '../reducers/teachingpage';
import authReducer from '../reducers/auth';
import homepageReducer from '../reducers/homepage';
import pointsReducer from '../reducers/points';
import categoriesReducer from '../reducers/categories';
import tableTemplateReducer from '../reducers/tableTemplate';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: EnhancedStore<RootState>;
}

export const getInitialState = (initialState: Partial<RootState> = {}): Partial<RootState> => ({
  // Provide a minimal valid initial state for all slices
  // to ensure the RootState is fully formed for the test.
  points: { items: [], status: 'idle', error: null },
  categories: { items: [], status: 'idle', error: null },
  tableTemplate: { data: null, status: 'idle', error: null },
  aboutpage: { data: null, status: 'idle', error: null },
  cvpage: { data: null, status: 'idle', error: null },
  eventspage: { categories: [], status: 'idle' },
  teachingpage: { teachings: [], status: 'idle', error: null },
  homepage: { items: [], status: 'idle', error: null },
  navigation: { isMenuOpen: false },
  auth: { uid: null },
  i18nState: { lang: 'en', fallbackLang: 'en', translations: {}, forceRefresh: false },
  // Allow overriding with test-specific state
  ...initialState,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    // Create a root reducer that matches the main application's store
    reducer: combineReducers({
      points: pointsReducer,
      categories: categoriesReducer,
      tableTemplate: tableTemplateReducer,
      aboutpage: aboutpageReducer,
      cvpage: cvpageReducer,
      eventspage: eventspageReducer,
      teachingpage: teachingpageReducer,
      auth: authReducer,
      homepage: homepageReducer,
      navigation: navigationReducer,
      i18nState,
    }),
    preloadedState
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
        <Provider store={store}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}