import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type mediaContent = {
  poster_path: string | null;
  profile_path: string | null;
  title: string;
  name: string;
  media_type: string;
  id: number;
};

type SearchState = {
  term: string;
  results: mediaContent[];
};

const initialState: SearchState = {
  term: "",
  results: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.term = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<mediaContent[]>) => {
      state.results = action.payload;
    },
    clearSearch: () => initialState,
  },
});

export const { setSearchTerm, setSearchResults, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
