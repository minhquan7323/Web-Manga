import React, { useEffect, useState } from 'react'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import { convertPrice } from '../../utils'
const AdminDashboard = () => {
    const [totalProduct, setTotalProduct] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalRevenue, setTotalRevenue] = useState(0)

    const fetchAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        setTotalProduct(res.totalProduct)
    }
    const fetchAllUser = async () => {
        const res = await UserService.getAllUser()
        setTotalUser(res.data.length)
    }
    const fetchAllOrder = async () => {
        const res = await OrderService.getAllOrder()
        setTotalOrder(res.data.length)
        const revenue = res.data.reduce((acc, order) => acc + order.itemsPrice, 0)
        setTotalRevenue(revenue)
    }
    useEffect(() => {
        fetchAllProduct()
        fetchAllUser()
        fetchAllOrder()
    }, [])

    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Dashboard management</div>
                </div>
            </div>
            <div className="container" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className="row">
                    <div className="col-6 admin-system-dashboard-block">
                        <div class="card item-box-shadow">
                            <div class="card-header card-header-dashboard">
                                Total customers
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{totalUser} customers</h5>
                                <p class="card-text">Total number of customers managed.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 admin-system-dashboard-block">
                        <div class="card item-box-shadow">
                            <div class="card-header card-header-dashboard">
                                Total products
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{totalProduct} products</h5>
                                <p class="card-text">Total number of products managed.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 admin-system-dashboard-block">
                        <div class="card item-box-shadow">
                            <div class="card-header card-header-dashboard">
                                total orders
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{totalOrder} orders</h5>
                                <p class="card-text">Total number of invoices placed.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 admin-system-dashboard-block">
                        <div class="card item-box-shadow">
                            <div class="card-header card-header-dashboard">
                                Total revenue
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{convertPrice(totalRevenue)} VND</h5>
                                <p class="card-text">Amount from completed orders.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminDashboard
