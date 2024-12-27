import React, { useEffect, useState } from 'react'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../Loading/Loading.js'
import { convertPrice } from '../../utils'

const AdminDashboard = () => {
    const [totalProduct, setTotalProduct] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    const fetchAllData = async () => {
        setIsLoading(true)
        setHasError(false)

        try {
            const [productRes, userRes, orderRes] = await Promise.all([
                ProductService.getAllProduct(),
                UserService.getAllUser(),
                OrderService.getAllOrder(),
            ])

            setTotalProduct(productRes.totalProduct || 0)
            setTotalUser(userRes.data?.length || 0)
            setTotalOrder(orderRes.data?.length || 0)

            const revenue = orderRes.data.reduce((acc, order) => acc + order.itemsPrice, 0)
            setTotalRevenue(revenue)
        } catch {
            setHasError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    return (
        <>
            <div className="admin-system-content-right bg">
                <div className="admin-title">
                    <div>Dashboard management</div>
                </div>
            </div>
            <Loading isLoading={isLoading}>
                {hasError ? ( // Kiểm tra nếu có lỗi
                    <div style={{ color: 'red', textAlign: 'center' }}>
                        Failed to load data. Please try again later.
                    </div>
                ) : (
                    <div className="container" style={{ maxWidth: '100%', margin: '0 auto' }}>
                        <div className="row">
                            <div className="col-6 admin-system-dashboard-block">
                                <div className="card item-box-shadow">
                                    <div className="card-header card-header-dashboard">Total customers</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{totalUser} customers</h5>
                                        <p className="card-text">Total number of customers managed.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 admin-system-dashboard-block">
                                <div className="card item-box-shadow">
                                    <div className="card-header card-header-dashboard">Total products</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{totalProduct} products</h5>
                                        <p className="card-text">Total number of products managed.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 admin-system-dashboard-block">
                                <div className="card item-box-shadow">
                                    <div className="card-header card-header-dashboard">Total orders</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{totalOrder} orders</h5>
                                        <p className="card-text">Total number of invoices placed.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 admin-system-dashboard-block">
                                <div className="card item-box-shadow">
                                    <div className="card-header card-header-dashboard">Total revenue</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{convertPrice(totalRevenue)} VND</h5>
                                        <p className="card-text">Amount from completed orders.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Loading>
        </>
    )
}

export default AdminDashboard
