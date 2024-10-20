import { configureStore } from '@reduxjs/toolkit'
import productReducer from './productSlide'
import userReducer from './userSlide'

export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer
    }
})