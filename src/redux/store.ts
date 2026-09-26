import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./loginState";
import { loadingSlice } from "./loadingState";

export const store = configureStore({
  reducer: {
    loginSetter: authSlice.reducer,
    loadingSetter: loadingSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
