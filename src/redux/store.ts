import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./loginState";
import { loadingSlice } from "./loadingState";

export const store = configureStore({
  reducer: {
    loginSetter: authSlice.reducer,
    loadingSetter: loadingSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
