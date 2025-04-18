import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';

// Import slices/reducers
const rootReducer = combineReducers({
  // Add reducers here as they're created
});

const isDevelopment = import.meta.env?.MODE === 'development' || import.meta.env?.DEV;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: isDevelopment,
});

// Enable listener behavior for RTK Query
setupListeners(store.dispatch);

export default store;
