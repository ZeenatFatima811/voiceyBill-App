import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { apiClient } from './api-client';
import authReducer from '../features/auth/authSlice';

type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [apiClient.reducerPath],
};

const rootReducer = combineReducers({
  [apiClient.reducerPath]: apiClient.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer<RootReducerType>(
  persistConfig,
  rootReducer
);

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: reduxPersistActions,
      },
    }).concat(apiClient.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
