import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import configConstants from "../configConstants";
import {noteTagTypes} from "../features/notes/services/noteTypes";

// Define a service using a base URL and expected endpoints
const baseURL = configConstants.VITE_NOTES_BASE_URL;
export const notesApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: "include",
    mode: "cors",
  }),

  // TODO: combine different endpoints defined in features/[featureName]/services See https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  tagTypes: [...noteTagTypes,],
  endpoints: () => ({}),
  reducerPath: "notesApi",
  keepUnusedDataFor: 0,
});

// eslint-disable-next-line no-empty-pattern
export const {} = notesApi;
