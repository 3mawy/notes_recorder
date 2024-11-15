import type { ApiResponse } from "../../../services/types";

export interface RegistrationCredentials {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface RegistrationResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  token?: string;
}

export type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Verify2FACode = {
  email: string;
  code: string;
};

export type PasswordRecoveryRequest = {
  email: string;
};

export type PasswordRecoveryConfirmRequest = {
  token: string;
  new_password: string;
  password_confirmation: string;
};

export type PasswordRecoveryResponse = ApiResponse

export type LogoutResponse = ApiResponse

export type LoginResponse = ApiResponse & {
  status: string;
  user?: UserProfile;
};

export type TwoFAResponse = {
  user: UserProfile;
};