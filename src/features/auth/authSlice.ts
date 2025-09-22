import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("accessToken", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
