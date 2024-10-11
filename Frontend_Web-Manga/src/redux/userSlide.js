import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
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
            const { name, email, address, avatar, _id, access_token } = action.payload
            state.name = name || email
            state.email = email
            state.address = address
            state.avatar = avatar
            state.id = _id
            state.access_token = access_token
        },
        resetUser: (state) => {
            state.name = ''
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