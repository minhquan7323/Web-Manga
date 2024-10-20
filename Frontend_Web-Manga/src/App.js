import { Outlet } from 'react-router-dom'
import React, { useEffect } from 'react'
import Header from './components/User/Header'
import Footer from './components/User/Footer'

import 'bootstrap/dist/css/bootstrap.min.css'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/userSlide'
import * as UserService from './services/UserService.js'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        const { decoded, storageData } = handleDecoded()
        if (decoded?.id != undefined) {
            handleGetDetailsUser(decoded?.id, storageData)
        }
    }, [])

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token')
        let decoded = {}
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData)
            decoded = jwtDecode(storageData)
        }
        return { decoded, storageData }
    }

    // const handleDecoded = () => {
    //     let storageData = localStorage.getItem('access_token')
    //     console.log('raw storageData', storageData);
    //     let decoded = {}
    //     if (storageData && isJsonString(storageData)) {
    //         storageData = JSON.parse(storageData)
    //         console.log('parsed storageData', storageData);
    //         try {
    //             decoded = jwtDecode(storageData)
    //             console.log('decoded token', decoded);
    //         } catch (error) {
    //             console.error('Error decoding token:', error)
    //         }
    //     } else {
    //         console.log('Invalid JSON string or empty storageData');
    //     }
    //     return { decoded, storageData }
    // }

    // UserService.axiosJWT.interceptors.request.use(async (config) => {
    //     const { decoded } = handleDecoded()
    //     const currentTime = new Date()
    //     if (decoded?.exp < Math.floor(currentTime.getTime() / 1000)) {
    //         const data = await UserService.refreshToken()
    //         config.headers['token'] = `Bearer ${data?.access_token}`
    //     }
    //     return config
    // }, function (error) {
    //     return Promise.reject(error)
    // })
    // UserService.axiosJWT.interceptors.request.use(async (config) => {
    //     const { decoded } = handleDecoded()
    //     const currentTime = new Date()
    //     if (decoded?.exp < Math.floor(currentTime.getTime() / 1000)) {
    //         const data = await UserService.refreshToken()
    //         localStorage.setItem('access_token', JSON.stringify(data?.access_token))
    //         config.headers['token'] = `Bearer ${data?.access_token}`
    //     }
    //     return config
    // }, function (error) {
    //     return Promise.reject(error)
    // })
    UserService.axiosJWT.interceptors.request.use(async (config) => {
        const { decoded } = handleDecoded()
        const currentTime = new Date().getTime() / 1000
        if (decoded?.exp < currentTime) {
            try {
                const data = await UserService.refreshToken()
                localStorage.setItem('access_token', JSON.stringify(data?.access_token))
                config.headers['token'] = `Bearer ${data?.access_token}`
            } catch (error) {
                console.error('Failed to refresh token:', error)
                return Promise.reject(error)
            }
        }
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    const handleGetDetailsUser = async (id, access_token) => {
        const res = await UserService.getDetailsUser(id, access_token)
        dispatch(updateUser({ ...res?.data, access_token: access_token }))
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
                <Footer />
            </div>
        </div>
    )
}
export default App