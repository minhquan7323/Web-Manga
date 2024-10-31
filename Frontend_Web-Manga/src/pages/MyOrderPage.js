import { useQuery } from "@tanstack/react-query"
import * as OrderService from '../services/OrderService.js'
import Loading from "../components/Loading/Loading.js"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutationHooks } from '../hooks/useMutationHook.js'
import * as message from "../components/Message/Message"
import React, { useEffect, useState } from "react"
import { convertPrice } from "../utils.js"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSelector } from "react-redux"

function MyOrderPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { state } = location
    const user = useSelector((state) => state?.user)

    const fetchAllMyOrder = async () => {
        const res = await OrderService.getAllDetailsOrder(state?.id, state?.access_token)
        return res.data
    }

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchAllMyOrder,
        retry: 3,
        retryDelay: 1000,
        enabled: Boolean(state?.id && state?.access_token)
    })

    const { isLoading, data } = queryOrder

    const mutationCancel = useMutationHooks(
        async (data) => {
            const { id, access_token, orderItems } = data
            const res = await OrderService.cancelOrder(id, access_token, orderItems)
            return res
        }
    )
    const { data: dataCancel, isSuccess: isSuccessCancel, isError: isErrorCancel } = mutationCancel
    const isLoadingCancel = mutationCancel.isPending

    const handleDetailsOrder = (id) => {
        navigate(`/detailsorder/${id}`, {
            state: {
                access_token: state?.access_token
            }
        })
    }

    const handleCancelOrder = (order) => {
        mutationCancel.mutate({ id: order?._id, access_token: state?.access_token, orderItems: order?.orderItems }, {
            onSuccess: () => {
                queryOrder.refetch()
            }
        })
    }

    const [expandedOrders, setExpandedOrders] = useState({})

    const toggleExpandOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId]
        }))
    }

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK')
            message.success()
        else if (isErrorCancel)
            message.error()
    }, [isSuccessCancel, isErrorCancel])



    const pages = [
        { key: 'profile', label: 'My account', iconClass: 'fas fa-user', path: '/profileuser' },
        { key: 'myorder', label: 'My purchase', iconClass: 'fas fa-receipt', path: '/myorder' },
    ]

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <Container className="my-order" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className='row my-order-box p-0'>
                    <Col xs={12} sm={4} md={3} lg={3} className="my-order-content-block">
                        <div className='my-order-content-left bg'>
                            <span>
                                {user?.avatar ? (
                                    <>
                                        <Row>
                                            <Col xs={3} sm={3} md={3} lg={3} className='my-order-user-img item-center'>
                                                <img src={user?.avatar} alt="avatar" />
                                            </Col>
                                            <Col xs={9} sm={9} md={9} lg={9} className='my-order-user'>
                                                <div>
                                                    {user?.name}
                                                </div>
                                                <div className="my-order-edit-profile-btn">
                                                    <i class="fas fa-pen"></i> Edit profile
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <i className="fa-solid fa-user"></i>
                                )}
                            </span>
                            <div className='my-order-content-left-block'>
                                {pages.map((page) => (
                                    <div
                                        key={page.key}
                                        onClick={() => navigate(page.path)}
                                        className={location.pathname.includes(page.path) ? 'active' : ''}
                                    >
                                        <i className={page.iconClass}></i> {page.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={8} md={9} lg={9} className="my-order-content-block">
                        {data?.map((order, index) => {
                            const isLastOrder = index === data.length - 1
                            const totalProducts = order.orderItems.reduce((sum, item) => sum + item.amount, 0)
                            const itemsToDisplay = expandedOrders[order._id] ? order.orderItems : order.orderItems.slice(0, 2)

                            return (
                                <div className='my-order-content-right bg' style={{ marginBottom: isLastOrder ? '0' : '10px' }} key={order._id}>
                                    <div className="my-order-delivery">
                                        <span>{order?.delivery ? 'Delivered' : 'In delivery'}</span>
                                    </div>
                                    <div>
                                        <Row className="g-2 item-center">
                                            {itemsToDisplay.map((item) => (
                                                <Col xs={12} className="my-order-item" key={item._id}>
                                                    <Row className="item-center">
                                                        <Col xs={3} className='my-order-img'>
                                                            <img src={item.image} alt={item.name} />
                                                        </Col>
                                                        <Col xs={9} className='my-order-details'>
                                                            <div className='my-order-name'>
                                                                <span>{item.name}</span>
                                                            </div>
                                                            <div className="my-order-price-amount">
                                                                <span>{convertPrice(item.price)} VND</span>
                                                                <div>x{item.amount}</div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>

                                    <div className="item-center my-order-btn-more-less">
                                        {order.orderItems.length > 2 && !expandedOrders[order._id] && (
                                            <button className="btn btn-outline-primary" onClick={() => toggleExpandOrder(order._id)}>See More</button>
                                        )}
                                        {expandedOrders[order._id] && order.orderItems.length > 2 && (
                                            <button className="btn btn-outline-secondary" onClick={() => toggleExpandOrder(order._id)}>See Less</button>
                                        )}
                                    </div>
                                    <hr style={{ width: '100%', margin: '20px 0' }} />
                                    <div className='my-order-total-amount item-center'>
                                        Total amount ({totalProducts} {totalProducts > 1 ? "products" : "product"}): <span className='m-0 my-order-total-price'>&nbsp;{convertPrice(order.totalPrice)} VND</span>
                                    </div>
                                    <div className="my-order-btn-group">
                                        <span>
                                            {order?.delivery ? (
                                                <button className="btn btn-outline-danger">Rating</button>
                                            ) : (
                                                <button onClick={() => handleCancelOrder(order)} className="btn btn-outline-secondary">Cancel order</button>
                                            )}
                                        </span>
                                        <span>
                                            <button onClick={() => handleDetailsOrder(order?._id)} className="btn btn-outline-primary">Details</button>
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </Col>
                </div>
            </Container>
        </Loading>
    )

}

export default MyOrderPage