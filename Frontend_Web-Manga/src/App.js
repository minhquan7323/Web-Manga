import { Outlet } from 'react-router-dom'
import React, { useEffect } from 'react'
import Header from './components/User/Header'
import Footer from './components/User/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/userSlide'
import * as UserService from './services/UserService.js'

function App() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        const { storageData, decoded } = handleDecoded()
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData)
        }
    }, [])

    const handleDecoded = () => {
        let storageData = user?.access_token || localStorage.getItem('access_token')
        let decoded = {}

        if (storageData && isJsonString(storageData) && !user?.access_token) {
            storageData = JSON.parse(storageData)
            decoded = jwtDecode(storageData)
        }
        return { decoded, storageData }
    }

    UserService.axiosJWT.interceptors.request.use(async (config) => {
        const currentTime = new Date()
        const { decoded } = handleDecoded()
        let storageRefreshToken = localStorage.getItem('refresh_token')
        const refresh_token = JSON.parse(storageRefreshToken)
        const decodedRefreshToken = jwtDecode(refresh_token)
        if (decoded?.exp < currentTime.getTime() / 1000) {
            if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
                const data = await UserService.refreshToken(refresh_token)
                // localStorage.setItem('access_token', JSON.stringify(data.access_token))
                config.headers['token'] = `Bearer ${data?.access_token}`
            } else {
                dispatch(resetUser())
            }
        }
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    const handleGetDetailsUser = async (id, access_token) => {
        const storageRefreshToken = localStorage.getItem('refresh_token')
        const refresh_token = JSON.parse(storageRefreshToken)
        const res = await UserService.getDetailsUser(id, access_token)
        dispatch(updateUser({ ...res?.data, access_token: access_token, refresh_token: refresh_token }))
    }

    return (
        <div>
            <div>
                <Header />
            </div>
            <div className='content'>
                <Outlet />
            </div>
            <div>
                {/* <Footer /> */}
            </div>
        </div>
    )
}

export default App