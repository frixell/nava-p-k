import { configureStore, combineReducers } from '@reduxjs/toolkit';
import aboutpageReducer from '../reducers/aboutpage'; // This will now resolve to aboutpage.ts
import cvpageReducer from '../reducers/cvpage';
import cvpageReducer from '../reducers/cvpage'; // This will now resolve to cvpage.ts
import eventspageReducer from '../reducers/eventspage'; // This will now resolve to eventspage.ts
import teachingpageReducer from '../reducers/teachingpage'; // Assuming this is still a .js file
import authReducer from '../reducers/auth'; // This will now resolve to auth.ts
import homepageReducer from '../reducers/homepage'; // This will now resolve to homepage.ts
import navigationReducer from '../reducers/navigation'; // This will now resolve to navigation.ts
import pointsReducer from '../reducers/points'; // This will now resolve to points.ts
import categoriesReducer from '../reducers/categories'; // This will now resolve to categories.ts
import tableTemplateReducer from '../reducers/tableTemplate'; // This will now resolve to tableTemplate.ts
import { i18nState } from "redux-i18n";

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
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
    i18nState
});

// Infer the `RootState` type from the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer,
    // Redux Toolkit automatically enables the Redux DevTools Extension
    // and applies redux-thunk middleware by default.
});

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;