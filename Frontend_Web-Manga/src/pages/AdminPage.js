import React, { useState } from 'react'
import { UserOutlined, ProductOutlined, DashboardOutlined, FileDoneOutlined, MenuOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { getItem } from "../utils"
import AdminUser from '../components/Admin/AdminUser'
import AdminProduct from '../components/Admin/AdminProduct'
import AdminOrder from '../components/Admin/AdminOrder'
import AdminDashboard from '../components/Admin/AdminDashboard'
import AdminCategory from '../components/Admin/AdminCategory'


const AdminPage = () => {
    const items = [
        getItem('Dashboard', 'dashboard', <DashboardOutlined />),
        getItem('User', 'user', <UserOutlined />),
        getItem('Product', 'product', <ProductOutlined />),
        getItem('Category', 'category', <MenuOutlined />),
        getItem('Order', 'order', <FileDoneOutlined />)
    ]

    const renderPage = (key) => {
        switch (key) {
            case 'dashboard':
                return <AdminDashboard />
            case 'user':
                return <AdminUser />
            case 'product':
                return <AdminProduct />
            case 'order':
                return <AdminOrder />
            case 'category':
                return <AdminCategory />
            default:
                return <AdminProduct />
        }
    }

    const rootSubmenuKeys = ['user', 'product', 'order', 'dashboard', 'category']
    const [keySelected, setKeySelected] = useState('dashboard')
    const [openKeys, setOpenKeys] = useState([keySelected])

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    }

    const handleOnClick = ({ key }) => {
        setKeySelected(key)
        setOpenKeys([key])
    }

    return (
        <>
            <div className="container admin-system" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className='row admin-system-box p-0'>
                    <div className="col-12 col-xs-12 col-sm-4 col-md-3 col-lg-3 admin-system-content-block">
                        <div className='admin-system-content-left bg'>
                            <div className='admin-system-content-left-block'>
                                <Menu
                                    mode="inline"
                                    openKeys={openKeys}
                                    onOpenChange={onOpenChange}
                                    items={items}
                                    onClick={handleOnClick}
                                    selectedKeys={[keySelected]}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xs-12 col-sm-8 col-md-9 col-lg-9 admin-system-content-block">
                        {renderPage(keySelected)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPage
