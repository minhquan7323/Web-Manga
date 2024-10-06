import axios from "axios"

export const signInUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signin`, data)
    return res.data
}
export const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, data)
    return res.data
}