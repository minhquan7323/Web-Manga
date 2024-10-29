// import { Outlet } from 'react-router-dom'
// import React, { useEffect } from 'react'
// import Header from './components/User/Header'
// import Footer from './components/User/Footer'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import { isJsonString } from './utils'
// import { jwtDecode } from 'jwt-decode'
// import { useDispatch } from 'react-redux'
// import { updateUser } from './redux/userSlide'
// import * as UserService from './services/UserService.js'

// function App() {
//     const dispatch = useDispatch()

//     useEffect(() => {
//         const { decoded, storageData } = handleDecoded()
//         if (decoded?.id) {
//             handleGetDetailsUser(decoded?.id, storageData)
//         }
//     }, [])

//     // UserService.axiosJWT.interceptors.request.use(async (config) => {
//     //     const { decoded } = handleDecoded()
//     //     const currentTime = new Date()
//     //     if (decoded?.exp < currentTime.getTime() / 1000) {
//     //         // if (decoded?.exp < Math.floor(currentTime.getTime() / 1000)) {
//     //         const data = await UserService.refreshToken()
//     //         // localStorage.setItem('access_token', JSON.stringify(data?.access_token))
//     //         config.headers['token'] = `Bearer ${data?.access_token}`
//     //         // try {
//     //         //     const data = await UserService.refreshToken();
//     //         //     localStorage.setItem('access_token', JSON.stringify(data?.access_token));
//     //         //     config.headers['token'] = `Bearer ${data?.access_token}`;
//     //         // } catch (error) {
//     //         //     return Promise.reject(error);
//     //         // }
//     //     }
//     //     return config
//     // }, (error) => {
//     //     return Promise.reject(error)
//     // })
//     UserService.axiosJWT.interceptors.request.use(async (config) => {
//         const { decoded, storageData } = handleDecoded();
//         const currentTime = Math.floor(Date.now() / 1000)
//         if (decoded?.exp < currentTime) {
//             try {
//                 const data = await UserService.refreshToken();
//                 if (data?.access_token) {
//                     localStorage.setItem('access_token', JSON.stringify(data?.access_token));
//                     config.headers['token'] = `Bearer ${data?.access_token}`;
//                 }
//             } catch (error) {
//                 console.error('Error refreshing token', error);
//                 return Promise.reject(error);
//             }
//         } else {
//             config.headers['token'] = `Bearer ${storageData}`;
//         }
//         return config;
//     }, (error) => {
//         return Promise.reject(error);
//     });

//     const handleDecoded = () => {
//         let storageData = localStorage.getItem('access_token')
//         let decoded = {}
//         if (storageData && isJsonString(storageData)) {
//             storageData = JSON.parse(storageData)
//             decoded = jwtDecode(storageData)
//         }
//         return { decoded, storageData }
//     }

//     const handleGetDetailsUser = async (id, access_token) => {
//         const res = await UserService.getDetailsUser(id, access_token)
//         dispatch(updateUser({ ...res?.data, access_token: access_token }))
//     }
//     return (
//         <div>
//             <div>
//                 <Header />
//             </div>
//             <div className='content'>
//                 <Outlet />
//             </div>
//             <div>
//                 <Footer />
//             </div>
//         </div>
//     )
// }
// export default App



import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import Header from './components/User/Header';
import Footer from './components/User/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/userSlide';
import * as UserService from './services/UserService.js';

function App() {
    const dispatch = useDispatch();

    // Đặt interceptor cho axiosJWT bên ngoài useEffect
    useEffect(() => {
        // Đặt interceptor chỉ một lần khi component được mount
        const requestInterceptor = UserService.axiosJWT.interceptors.request.use(
            async (config) => {
                const { decoded, storageData } = handleDecoded();
                const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại theo giây

                // Kiểm tra xem token đã hết hạn chưa
                if (decoded?.exp < currentTime) {
                    try {
                        const data = await UserService.refreshToken(); // Gọi hàm làm mới token
                        if (data?.access_token) {
                            localStorage.setItem('access_token', JSON.stringify(data.access_token));
                            config.headers['token'] = `Bearer ${data.access_token}`;
                        }
                    } catch (error) {
                        console.error('Error refreshing token', error);
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }
                } else {
                    config.headers['token'] = `Bearer ${storageData}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        return () => {
            UserService.axiosJWT.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    useEffect(() => {
        const { decoded, storageData } = handleDecoded();
        if (decoded?.id) {
            handleGetDetailsUser(decoded.id, storageData);
        }
    }, []);

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData };
    };

    const handleGetDetailsUser = async (id, access_token) => {
        const res = await UserService.getDetailsUser(id, access_token);
        dispatch(updateUser({ ...res?.data, access_token: access_token }));
    };

    return (
        <div>
            <Header />
            <div className='content'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default App;
