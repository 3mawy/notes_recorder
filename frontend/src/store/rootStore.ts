import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { notesApi } from "../services/notesApi";
import { authReducer } from "../features/auth/authSlice";
import { layoutReducer } from "./layoutSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { rtkQueryErrorMiddleware } from "./middleware/rtkQueryErrorMiddleware";
import { persistConfig } from "./config/persistConfig";
import { unauthenticatedMiddleware } from "./middleware/unauthenticatedMiddleware";
import { audioReducer } from "../features/notes/audioSlice";

// Create the root reducer separately, so we can extract the RootState type
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig.authPersistConfig, authReducer),
  layout: layoutReducer,
  audio: audioReducer,
  [notesApi.reducerPath]: notesApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const setupStore = (preloadedState: Partial<RootState>) => {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(notesApi.middleware, rtkQueryErrorMiddleware, unauthenticatedMiddleware),
    reducer: rootReducer,
    preloadedState: preloadedState,
  });
};

export type AppStore = ReturnType<typeof setupStore>;

export const rootStore = setupStore({});
export const persistor = persistStore(rootStore);

export type AppDispatch = typeof rootStore.dispatch;

setupListeners(rootStore.dispatch);
