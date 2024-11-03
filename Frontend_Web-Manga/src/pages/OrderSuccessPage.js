import React from 'react'
import { convertPrice } from '../utils'
import { useLocation, useNavigate } from 'react-router-dom'
import { orderContant } from '../contant'
import Step from '../components/User/Step'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import { useSelector } from 'react-redux'

const OrderSuccessPage = () => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location

    const handleClickNav = (type, id) => {
        if (type === 'myorder') {
            navigate(`/myorder`, {
                state: {
                    id: user?.id,
                    access_token: user?.access_token
                }
            })
        } else if (type === 'product') {
            navigate('/product')
        } else if (type === 'details') {
            navigate(`/product/details/${id}`)
        }
    }
    // const handleDetailsProduct = (id) => {
    //     navigate(`/product/details/${id}`)
    // }

    const totalProducts = state?.order?.reduce((sum, item) => sum + item.amount, 0)

    return (
        <>
            <div>
                <div className='cart-page-title-container'>
                    <h2 className='m-0 cart-page-title'>
                        Order Success
                    </h2>
                </div>
                <div className='container cart-container' style={{ maxWidth: '100%', margin: '0 auto' }}>
                    <div className='row  item-center'>
                        <div className='col-xs-12 col-sm-12 col-md-8 col-lg-7 cart-item-header-block'>
                            <div className='cart-item-block p-0'>
                                <div className='cart-item-inner bg'>
                                    <div className='row timeline-step m-0'>
                                        <Step current={3} />
                                    </div>
                                    <span className='item-center'>
                                        <hr style={{ width: '95%' }} />
                                    </span>
                                    <div className='cart-item-payment'>
                                        <div>
                                            <div>
                                                <h4>Delivery method</h4>
                                            </div>
                                            <div>
                                                <label>
                                                    {orderContant.delivery[state?.delivery]}
                                                </label>
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <div>
                                                <h4>Payment method</h4>
                                            </div>
                                            <div>
                                                <label>
                                                    {orderContant.payment[state?.payment]}
                                                </label>
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            {state.order?.map((orderItem, index) => {
                                                const isLastOrder = index === state.order?.length - 1
                                                return (
                                                    <>
                                                        <Row className="g-2 item-center" style={{ marginBottom: isLastOrder ? '0' : '10px' }}>
                                                            <Col xs={12} className="my-order-item" key={orderItem.product}>
                                                                <Row className="item-center">
                                                                    <Col xs={3} className='my-order-img'>
                                                                        <div >
                                                                            <img src={orderItem.image} alt={orderItem.name} onClick={() => handleClickNav('details', orderItem.product)} />
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={9} className='my-order-details'>
                                                                        <div className='my-order-name'>
                                                                            <span>{orderItem.name}</span>
                                                                        </div>
                                                                        <div className="my-order-price-amount">
                                                                            <span>{convertPrice(orderItem.price)} VND</span>
                                                                            <div>x{orderItem.amount}</div>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            })}
                                            <hr style={{ width: '100%', margin: '20px 0' }} />
                                            <div className='my-order-total-amount item-center'>
                                                Total amount ({totalProducts} {totalProducts > 1 ? "products" : "product"}): <span className='m-0 my-order-total-price'>&nbsp;{convertPrice((state?.totalAmountMemo))} VND</span>
                                            </div>
                                            <div className='my-order-btn-group'>
                                                <span>
                                                    <button className="btn btn-outline-primary" onClick={() => handleClickNav('product')}>
                                                        Continue buying
                                                    </button>
                                                </span>
                                                <span>
                                                    <button className="btn btn-outline-primary" onClick={() => handleClickNav('myorder')}>
                                                        My order
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSuccessPage
