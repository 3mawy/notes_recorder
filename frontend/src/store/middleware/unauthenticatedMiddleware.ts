import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../../features/auth/authSlice";

export const unauthenticatedMiddleware: Middleware = (store) => {
  return (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const error = action.payload as FetchBaseQueryError;

      const statusCode = Number(error.status);
      if (statusCode === 401) {
        store.dispatch(logout());
      }
    }
    return next(action);
  };
};
