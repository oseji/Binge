import { createSlice } from "@reduxjs/toolkit";

export interface authState {
  isLoggedIn: boolean;
}

const initialState: authState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "isLoggedIn",
  initialState,
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
    },
    toggleLoginState: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
  },
});

export const { logIn, logOut, toggleLoginState } = authSlice.actions;

export default authSlice.reducer;
