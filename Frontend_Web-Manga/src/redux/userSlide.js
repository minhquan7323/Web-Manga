import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    id: '',
    access_token: ''
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', phone = '', email = '', address = '', avatar = '', _id = '', access_token = '' } = action.payload
            state.name = name
            state.phone = phone
            state.email = email
            state.address = address
            state.avatar = avatar
            state.id = _id
            state.access_token = access_token
        },
        resetUser: (state) => {
            state.name = ''
            state.phone = ''
            state.email = ''
            state.address = ''
            state.avatar = ''
            state.id = ''
            state.access_token = ''
        }
    }
})

export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer