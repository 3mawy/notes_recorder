import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ErrorInformation } from "../../services/types";
import toast from "../../utils/toast";


export const rtkQueryErrorMiddleware: Middleware = () => {
  let errorIds = new Set<string>();

  return (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const error = action.payload as FetchBaseQueryError;

      const statusCode = Number(error.status);
      if (statusCode >= 500 && statusCode < 600) {
        const errorId = JSON.stringify(error);
        const error_data = error.data as ErrorInformation;

        if (!errorIds.has(errorId)) {
          toast.error({
            title: `Error ${error.status}`,
            description: error_data.detail || 'An error occurred',
          });
          errorIds.add(errorId);
        }
      }
    } else {
      errorIds = new Set<string>();
    }
    return next(action);
  };
};
