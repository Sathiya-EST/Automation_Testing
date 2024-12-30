import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth/login';
import { revokeApi } from './services/auth/logout';
import { masterApi } from './services/master/module';
import authReducer from './slice/authSlice'
import appReducer from './slice/appSlice'
import masterReducer from './slice/masterSlice'
import { formApi } from './services/master/form';
import { isPlain } from '@reduxjs/toolkit';
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [revokeApi.reducerPath]: revokeApi.reducer,
    [masterApi.reducerPath]: masterApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
    auth: authReducer,
    app: appReducer,
    master: masterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['FormApi/executeMutation/fulfilled'],
        ignoredPaths: ['FormApi.mutations'],
        isSerializable: (value: any) => {
          if (value instanceof Blob) return true;
          return isPlain(value);
        }
      }
    })
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


