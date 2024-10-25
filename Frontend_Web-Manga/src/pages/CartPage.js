import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeOrderProduct } from '../redux/orderSlide'

const CartPage = () => {
    const order = useSelector((state) => state.order)
    const [listChecked, setListChecked] = useState([])
    const dispatch = useDispatch()

    const decreaseQuantity = (idProduct) => {
        // if (quantity > 1) {
        //     setQuantity(quantity - 1)
        // }
        dispatch(decreaseAmount({ idProduct }))
    }
    const increaseQuantity = (idProduct) => {
        // if (quantity < 10) {
        //     setQuantity(quantity + 1)
        // }
        dispatch(increaseAmount({ idProduct }))

    }
    const handleOnChangeCheck = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    }

    const handleOnChangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }
    const handleChange = (e) => {
        // const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
        // setQuantity(value)
    }
    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))

    }
    const handleRemoveAllOrderProduct = () => {
        if (listChecked?.length > 1) {

            dispatch(handleRemoveAllOrderProduct({ listChecked }))
        }

    }
    return (
        <>
            <div>
                <div className='cart-page-title-container'>
                    <h2 className='m-0 cart-page-title'>
                        shopping cart
                    </h2>
                </div>
                <div className='container cart-container' style={{ maxWidth: '100%', margin: '0 auto' }}>
                    <div className='row'>
                        <div className='col-8 cart-item-header-block'>
                            <div className='cart-item-header-inner bg'>
                                <div className='row cart-item-header'>
                                    <div className='col-1 cart-item-header-check item-center'>
                                        <input onChange={handleOnChangeCheckAll} checked={listChecked?.length === order?.orderItems?.length} className="form-check-input m-0" type="checkbox" value="" aria-label="..." />
                                    </div>
                                    <div className='col-2 p-0'>
                                        Select all
                                    </div>
                                    <div className='col-8 row item-center p-0'>
                                        <div className='col-6'>
                                        </div>
                                        <div className='col-6 row p-0' >
                                            <div className='col-6 item-center p-0'>
                                                Amount
                                            </div>
                                            <div className='col-6 item-center p-0'>
                                                Total amount
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-1 item-center p-0'>
                                        <i className="fas fa-trash-can" onClick={handleRemoveAllOrderProduct} style={{ cursor: 'pointer' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-8 cart-item-block'>

                            <div className='cart-item-inner bg'>
                                {order?.orderItems?.map((orderItem) => {
                                    return (
                                        <div className='row cart-item-product' key={orderItem.product}>
                                            <div className='col-1 cart-product-check'>
                                                <input className="form-check-input" checked={listChecked.includes(orderItem.product)} onChange={handleOnChangeCheck} type="checkbox" value={orderItem.product} aria-label="..." />
                                            </div>
                                            <div className='col-2 cart-product-img p-0'>
                                                <img src={orderItem.image} alt='img' />
                                            </div>
                                            <div className='col-8 row cart-product-group-info p-0'>
                                                <div className='col-6 cart-product-info p-0'>
                                                    <div className='cart-product-title'>
                                                        <h5>{orderItem.name}</h5>
                                                    </div>
                                                    <div className='cart-product-price-original'>
                                                        <h6>{orderItem.price.toLocaleString().replace(/,/g, '.')} VND</h6>
                                                    </div>
                                                </div>
                                                <div className='col-6 row cart-product-number p-0'>
                                                    <div className='col-6 item-center p-0'>
                                                        <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                            <button type="button" className="btn btn-outline-secondary" onClick={() => decreaseQuantity(orderItem.product)}>
                                                                <i className="fas fa-minus"></i>
                                                            </button>
                                                            <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={orderItem.amount} onChange={handleChange} style={{ maxWidth: '35px', minWidth: '35px', color: 'black' }} />
                                                            <button type="button" className="btn btn-outline-secondary" onClick={() => increaseQuantity(orderItem.product)}>
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='col-6 cart-product-price-total p-0'>
                                                        <h6 className='m-0'><b>{(orderItem.price * orderItem.amount).toLocaleString().replace(/,/g, '.')} VND</b></h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-1 cart-product-remove p-0'>
                                                <i className="fas fa-trash-can" onClick={() => handleDeleteOrder(order.product)} style={{ cursor: 'pointer' }}></i>
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* <hr style={{ width: '95%', margin: '0 auto' }} /> */}
                            </div>

                        </div>
                        <div className='col-4'>
                            <div className=' cart-total-block'>
                                <div className='cart-total-inner bg'>
                                    <div className='cart-total'>
                                        <div>
                                            <h6><b>Total amount</b></h6>
                                        </div>
                                        <div className='cart-total-number'>
                                            <h5><b>999000 VND</b></h5>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-danger cart-payment-btn btn-lg">Proceed to Payment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage
