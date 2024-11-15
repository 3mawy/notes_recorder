import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/rootStore";
import constants from "../../configConstants";

const initialState = {
  user:
    constants.VITE_IS_AUTH_DISABLED === "true"
      ? {
          email: "devuser@example.com",
          first_name: "Dev",
          last_name: "User",
          is_authenticated: true,
        }
      : { email: "", first_name: "", last_name: "", is_authenticated: false },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.user.email = action.payload.user.email;
      state.user.first_name = action.payload.user.first_name;
      state.user.last_name = action.payload.user.last_name;
      state.user.is_authenticated = true;
    },
    logout(state) {
      state.user = initialState.user;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const isAuth = (state: RootState) => state.auth.user?.is_authenticated;

export const authReducer = authSlice.reducer;
