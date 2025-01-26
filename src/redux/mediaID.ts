import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface mediaID {
  mediaID: number;
}

const initialState: mediaID = {
  mediaID: 0,
};

export const mediaIDSlice = createSlice({
  name: "mediaID",
  initialState,
  reducers: {
    setmediaID: (state, action: PayloadAction<number>) => {
      state.mediaID = action.payload;
    },
  },
});

export const { setmediaID } = mediaIDSlice.actions;

export default mediaIDSlice.reducer;
