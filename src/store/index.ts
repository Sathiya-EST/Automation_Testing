// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth/login';
import { revokeApi } from './services/auth/logout';
import authReducer from './slice/authSlice'
// Configure the Redux store
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [revokeApi.reducerPath]: revokeApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(revokeApi.middleware), 
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;


