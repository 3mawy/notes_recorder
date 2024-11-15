import storage from "redux-persist/lib/storage";

export const persistConfig = {
  authPersistConfig: {
    key: "auth",
    storage,
  },
};