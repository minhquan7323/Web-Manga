import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../utils'
import { useLocation, useNavigate } from 'react-router-dom'
import * as OrderService from '../services/OrderService'
import Loading from '../components/Loading/Loading'
import { orderContant } from '../contant'

const OrderSuccessPage = () => {
    const order = useSelector((state) => state.order)
    const navigate = useNavigate()
    const location = useLocation()

    const { state } = location

    const handleDetailsProduct = (id) => {
        navigate(`/product/details/${id}`)
    }


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
                        <div className='col-7 cart-item-header-block'>
                            <div className='cart-item-block p-0'>
                                <div className='cart-item-inner bg'>
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
                                        <div>
                                            {state.order?.map((orderItem) => {
                                                return (
                                                    <div className='row cart-item-product' key={orderItem.product}>
                                                        <div className='col-2 cart-product-img p-0'>
                                                            <img src={orderItem.image} alt='img' onClick={() => handleDetailsProduct(orderItem.product)} style={{ cursor: 'pointer' }} />
                                                        </div>
                                                        <div className='col-9 row cart-product-group-info p-0'>
                                                            <div className='col-6 cart-product-info'>
                                                                <h5>{orderItem.name}</h5>
                                                            </div>
                                                            <div className='col-6 row cart-product-number p-0'>
                                                                <div className='col-6 cart-product-price-total p-0'>
                                                                    <h6 className='m-0'><b>{convertPrice(orderItem.price)} VND</b></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-1 p-0'>
                                                            {orderItem.amount}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <h6 className='m-0'><b>{convertPrice((state?.totalAmountMemo))} VND</b></h6>
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
