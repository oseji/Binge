import { createSlice } from "@reduxjs/toolkit";

export interface loadingState {
  isLoading: boolean;
}

const initialState: loadingState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "isLoading",
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
    notLoading: (state) => {
      state.isLoading = false;
    },
    toggleLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
  },
});

export const { loading, notLoading, toggleLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
