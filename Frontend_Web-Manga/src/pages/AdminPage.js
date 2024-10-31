import React, { useState } from 'react'
import { UserOutlined, ProductOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { getItem } from "../utils"
import AdminUser from '../components/Admin/AdminUser'
import AdminProduct from '../components/Admin/AdminProduct'

const AdminPage = () => {
    const items = [
        getItem('User', 'user', <UserOutlined />),
        getItem('Product', 'product', <ProductOutlined />)
    ]

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />
            case 'product':
                return <AdminProduct />
            default:
                return <AdminProduct />
        }
    }

    const rootSubmenuKeys = ['user', 'product']
    const [keySelected, setKeySelected] = useState('product')
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
