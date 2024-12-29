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
    setTrue: (state) => {
      state.isLoggedIn = true;
    },
    setFalse: (state) => {
      state.isLoggedIn = false;
    },
    toggleLoginState: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
  },
});

export const { setTrue, setFalse, toggleLoginState } = authSlice.actions;

export default authSlice.reducer;
