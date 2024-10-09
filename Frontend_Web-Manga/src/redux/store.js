import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlide'
import userReducer from './userSlide'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer
    }
})