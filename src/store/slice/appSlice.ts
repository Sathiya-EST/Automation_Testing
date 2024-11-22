// src/store/breadcrumbSlice.ts
import { BreadcrumbItemType } from '@/types/data';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BreadcrumbState {
  items: BreadcrumbItemType[];
}

const initialState: BreadcrumbState = {
  items: []
};

const appSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    setBreadcrumbs(state, action: PayloadAction<BreadcrumbItemType[]>) {
      state.items = action.payload;
    },
    updateBreadcrumb(state, action: PayloadAction<{ index: number; breadcrumb: BreadcrumbItemType }>) {
      state.items[action.payload.index] = action.payload.breadcrumb;
    },
  },
});

export const { setBreadcrumbs, updateBreadcrumb } = appSlice.actions;

export default appSlice.reducer;
