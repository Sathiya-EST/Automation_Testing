import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth/login';
import { revokeApi } from './services/auth/logout';
import { masterApi } from './services/master/module';
import authReducer from './slice/authSlice'
import appReducer from './slice/appSlice'
import { formApi } from './services/master/form';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [revokeApi.reducerPath]: revokeApi.reducer,
    [masterApi.reducerPath]: masterApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
    auth: authReducer,
    app: appReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(revokeApi.middleware)
      .concat(masterApi.middleware)
      .concat(formApi.middleware)
  ,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


