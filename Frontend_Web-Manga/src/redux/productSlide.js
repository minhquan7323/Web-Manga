import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    search: '',
}
export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload
        }
    }
})

export const { searchProduct } = productSlice.actions

export default productSlice.reducer