import { notesApi } from "../../../services/notesApi";
import type {
  UserProfile,
  LoginCredentials,
  LoginResponse,
  Verify2FACode,
  PasswordRecoveryRequest,
  PasswordRecoveryConfirmRequest,
  PasswordRecoveryResponse,
  TwoFAResponse,
  LogoutResponse, RegistrationResponse, RegistrationCredentials
} from "./authTypes";

const authEndpoints = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/api/profile/",
    }),
    loginUser: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/api/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    verify2FACode: builder.mutation<TwoFAResponse, Verify2FACode>({
      query: (data) => ({
        url: "/api/2fa/",
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/api/logout/",
        method: "POST",
      }),
    }),
    requestPasswordRecovery: builder.mutation<PasswordRecoveryResponse, PasswordRecoveryRequest>({
      query: (data) => ({
        url: "/api/password-recovery/",
        method: "POST",
        body: data,
      }),
    }),
    confirmPasswordRecovery: builder.mutation<PasswordRecoveryResponse, PasswordRecoveryConfirmRequest>({
      query: (data) => ({
        url: "/api/password-recovery/confirm/",
        method: "POST",
        body: data,
      }),

    }),
    registerUser: builder.mutation<RegistrationResponse, RegistrationCredentials>({
      query: (credentials) => ({
        url: "/api/register/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});


export const {
  useGetUserProfileQuery,
  useLoginUserMutation,
  useVerify2FACodeMutation,
  useLogoutUserMutation,
  useRequestPasswordRecoveryMutation,
  useConfirmPasswordRecoveryMutation,
  useRegisterUserMutation,
} = authEndpoints;
