import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import Header from './components/User/Header'
import Footer from './components/User/Footer'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    useEffect(() => {
        fetchApi()
    }, [])
    const fetchApi = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/getall`)
        console.log('res', res.data.data)

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