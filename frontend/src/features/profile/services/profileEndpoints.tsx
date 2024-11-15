import { notesApi } from "../../../services/notesApi";
import type {
  UserProfile,
} from "./profileTypes";

const profileEndpoints = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/api/profile/",
    }),
  }),
});

export const {
  useGetUserProfileQuery,
} = profileEndpoints;
