import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface mediaType {
  mediaType: string;
}

const initialState: mediaType = {
  mediaType: "",
};

export const mediaTypeSlice = createSlice({
  name: "mediaType",
  initialState,
  reducers: {
    setmediaType: (state, action: PayloadAction<string>) => {
      state.mediaType = action.payload;
    },
  },
});

export const { setmediaType } = mediaTypeSlice.actions;

export default mediaTypeSlice.reducer;
