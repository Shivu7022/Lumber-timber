import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    setProductsSuccess(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    setProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const { setProductsStart, setProductsSuccess, setProductsFailure } = productSlice.actions;
export default productSlice.reducer;
