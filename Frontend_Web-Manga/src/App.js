import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/User/Header'
import Footer from './components/User/Footer'

import 'bootstrap/dist/css/bootstrap.min.css'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/userSlide'
import * as UserService from './services/UserService.js'
import axios from 'axios'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        const { storageData, decoded } = handleDecoded()
        if (decoded?.id) {
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

    UserService.axiosJWT.interceptors.request.use(async (config) => {
        const { decoded } = handleDecoded()
        const currentTime = new Date()
        if (decoded?.exp < currentTime.getTime() / 1000) {
            const data = await UserService.refreshToken()
            config.headers['token'] = `Bearer ${data?.access_token}`
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