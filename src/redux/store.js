import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginReducer from './loginRedux';
import userReducer from './userRedux';
import roleReducer from './roleRedux';
import userTypeReducer from './userTypeRedux';
import permissionReducer from './permissionRedux';
import competitionReducer from './competitionRedux';
import clubReducer from './clubRedux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  userType: userTypeReducer,
  role: roleReducer,
  permission: permissionReducer,
  competition: competitionReducer,
  club: clubReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
