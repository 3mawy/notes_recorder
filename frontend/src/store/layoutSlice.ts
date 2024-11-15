 
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

 
export interface LayoutState {
  isMenuOpen: boolean;
}

const initialState: LayoutState = {
  isMenuOpen: false,
};

export const layoutSlice = createSlice({
  initialState,
  name: "layoutSlice",
  reducers: {
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
  },
});

export const { setMenuOpen } = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
