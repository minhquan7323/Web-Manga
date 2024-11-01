import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../utils'
import { useNavigate } from 'react-router-dom'
import { Modal as BootstrapModal } from 'bootstrap'
import { useMutationHooks } from '../hooks/useMutationHook'
import * as OrderService from '../services/OrderService'
import * as PaymentService from '../services/PaymentService'
import Loading from '../components/Loading/Loading'
import * as message from "../components/Message/Message"
import { updateUser } from '../redux/userSlide'
import { removeAllOrderProduct } from '../redux/orderSlide'
import { PayPalButton } from "react-paypal-button-v2";

const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

    const [sdkReady, setSdkReady] = useState(false)
    const [delivery, setDelivery] = useState('fast')
    const [payment, setPayment] = useState('later_money')

    const dispatch = useDispatch()

    const [stateDetailsUser, setStateDetailsUser] = useState({
        name: '',
        phone: '',
        address: '',
    })

    const navigate = useNavigate()



    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])
    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.discount * cur.amount))
        }, 0)
        if (Number(result)) {
            return result
        } else {
            return 0
        }
    }, [order])
    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo > 100000)
            return 30000
        else if (priceMemo === 0)
            return 0
        else
            return 15000
    }, [priceMemo])
    const totalAmountMemo = useMemo(() => {
        return priceMemo + deliveryPriceMemo
    }, [priceMemo, deliveryPriceMemo])

    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSelected && user?.name && user?.address && user?.phone && priceMemo && user?.id)
            mutationAddOrder.mutate({
                access_token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                totalPrice: totalAmountMemo,
                user: user?.id,
            })
    }

    const handleChangeAddress = () => {
        const modalUpdateInfoElement = document.getElementById('modalUpdateInfo')
        if (modalUpdateInfoElement) {
            const modalInstance = BootstrapModal.getOrCreateInstance(modalUpdateInfoElement)
            if (modalInstance) {
                setStateDetailsUser({
                    name: user?.name,
                    address: user?.address,
                    phone: user?.phone
                })
                modalInstance.show()
            }
        }
    }

    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await OrderService.createOrder(id, rests, access_token)
            if (res?.status == 'OK') {
                handleCancel()
                // dispatch(createOrder({ ...rests, access_token: access_token }))
                message.success()
            }
            return res
        }
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const isLoadingUpdated = mutationUpdate.isPending

    const mutationAddOrder = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await OrderService.createOrder(rests, access_token)
            if (res?.status == 'OK') {
                const arrayOrdered = []
                order?.orderItemsSelected?.forEach(element => {
                    arrayOrdered.push(element.product)
                });
                dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
                handleCancel()
                message.success()
                navigate('/ordersuccess', {
                    state: {
                        delivery,
                        payment,
                        order: order?.orderItemsSelected,
                        totalAmountMemo: totalAmountMemo
                    }
                })
            }
            return res
        }
    )
    const { data: dataAddOrder, isSuccess: isSuccessAddOrder, isError: isErrorAddOrder } = mutationAddOrder
    const isLoadingAddOrder = mutationAddOrder.isPending

    const handleOnchangeDetails = (e) => {
        setStateDetailsUser({
            ...stateDetailsUser,
            [e.target.name]: e.target.value
        })
    }

    const handleDelivery = (e) => {
        setDelivery(e.target.value)

    }
    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const handleUpdateUser = () => {
        const { name, address, phone, avatar, email } = stateDetailsUser
        if (name && address && phone) {
            mutationUpdate.reset();
            mutationUpdate.mutate({ id: user?.id, ...stateDetailsUser, access_token: user?.access_token })
            dispatch(updateUser({ name, address, phone }))
        }
    }

    const handleCancel = () => {
        const modalUpdateInfoElement = document.getElementById('modalUpdateInfo')
        if (modalUpdateInfoElement) {
            const modalInstance = BootstrapModal.getOrCreateInstance(modalUpdateInfoElement)
            if (modalInstance) {
                modalInstance.hide()
            }
        }
    }
    useEffect(() => {
        const modalElement = document.getElementById('modalUpdateInfo')
        const handleModalHidden = () => {
            handleCancel()
        }
        modalElement.addEventListener('hidden.bs.modal', handleModalHidden)
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalHidden)
        }
    }, [])

    const isDetailsUserFormValid = stateDetailsUser.name !== '' && stateDetailsUser.phone !== '' && stateDetailsUser.address !== ''

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate({
            access_token: user?.access_token,
            orderItems: order?.orderItemsSelected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalAmountMemo,
            user: user?.id,
            isPaid: true,
            email: user?.email,
            // paidAt: details.update_time
        })
    }

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig()
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://sandbox.paypal.com/sdk/js?client-id=${data}`
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }
    useEffect(() => {
        if (!window.paypal)
            addPaypalScript()
        else
            setSdkReady(true)

    }, [])

    return (
        <>
            <div>
                <div className='cart-page-title-container'>
                    <h2 className='m-0 cart-page-title'>
                        Payment
                    </h2>
                </div>
                <div className='container cart-container' style={{ maxWidth: '100%', margin: '0 auto' }}>
                    <div className='row'>
                        <div className='col-12 col-xs-12 col-sm-6 col-md-6 col-lg-8 cart-item-header-block'>
                            <div className='cart-item-block p-0'>
                                <div className='cart-item-inner bg'>
                                    <div className='cart-item-payment'>
                                        <div>
                                            <div>
                                                <h4>Delivery method</h4>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" onChange={handleDelivery} value="fast" type="radio" name="flexRadioDefaultDelivery" id="flexRadioDefault1" checked={delivery === 'fast'} />
                                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                    fast
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" onChange={handleDelivery} value="standard" type="radio" name="flexRadioDefaultDelivery" id="flexRadioDefault2" checked={delivery === 'standard'} />
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    standard
                                                </label>
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <div>
                                                <h4>Payment method</h4>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" onChange={handlePayment} value="later_money" type="radio" name="flexRadioDefaultPayment" id="flexRadioDefault3" checked={payment === 'later_money'} />
                                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                    pay later
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" onChange={handlePayment} value="paypal" type="radio" name="flexRadioDefaultPayment" id="flexRadioDefault5" checked={payment === 'paypal'} />
                                                <label className="form-check-label" htmlFor="flexRadioDefault5">
                                                    Paypal
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-xs-12 col-sm-6 col-md-6 col-lg-4'>
                            <Loading isLoading={isLoadingAddOrder}>
                                <div className=' cart-total-block p-0'>
                                    <div className='cart-total-inner bg'>
                                        <div className='cart-total'>
                                            <div>
                                                <p>Address</p>
                                            </div>
                                            <div className='cart-total-number'>
                                                <p><b>{user?.address}</b></p>
                                            </div>
                                            {/* <div>
                                            <p onClick={handleChangeAddress}><b>Change</b></p>
                                        </div> */}
                                        </div>
                                        <hr />
                                        <div className='cart-total'>
                                            <div>
                                                <p>Estimated amount</p>
                                            </div>
                                            <div className='cart-total-number'>
                                                <p><b>{convertPrice(priceMemo)} VND</b></p>
                                            </div>
                                        </div>
                                        <div className='cart-total'>
                                            <div>
                                                <p>Discount</p>
                                            </div>
                                            <div className='cart-total-number'>
                                                <p><b>0 %</b></p>
                                            </div>
                                        </div>
                                        <div className='cart-total'>
                                            <div>
                                                <p>Shipping fee</p>
                                            </div>
                                            <div className='cart-total-number'>
                                                <p><b>{convertPrice(deliveryPriceMemo)} VND</b></p>
                                            </div>
                                        </div>
                                        <div className='cart-total'>
                                            <div>
                                                <h5><b>Total amount</b></h5>
                                            </div>
                                            <div className='cart-total-number'>
                                                <h5><b>{convertPrice(totalAmountMemo)} VND</b></h5>
                                            </div>
                                        </div>
                                        {payment === 'paypal' && sdkReady ? (
                                            <PayPalButton
                                                amount={Math.round(totalAmountMemo / 25000)}
                                                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                onSuccess={onSuccessPaypal}
                                                onError={() => {
                                                    alert("Transaction completed err");

                                                }}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleAddOrder()}
                                                className="btn btn-danger cart-payment-btn btn-lg">
                                                Order
                                            </button>
                                        )}
                                        {/* <button type="button" style={{ cursor: 'not-allowed' }} className="btn btn-secondary cart-payment-btn btn-lg">Proceed to Payment</button> */}
                                    </div>
                                </div>
                            </Loading>
                        </div>
                    </div>

                    <div className="modal fade" id="modalUpdateInfo" tabIndex="-1" aria-labelledby="modalUpdateInfo" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalUpdateInfo">Update information</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>

                                <Loading isLoading={isLoadingUpdated}>
                                    <div className="modal-body">
                                        <div className="body">
                                            <div className="row">
                                                <div className="form-floating mb-3 col-12">
                                                    <input type="name" className="form-control" id="nameDetail" placeholder="name" value={stateDetailsUser.name} name="name" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="name">Name</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="tel" className="form-control" id="phoneDetail" placeholder="0123123123" value={stateDetailsUser.phone} name="phone" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="phone">Phone</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="address" className="form-control" id="addressDetail" placeholder="address" value={stateDetailsUser.address || ''} name="address" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="address">Address</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                        {/* <Loading isLoading={isLoadingUpdated}> */}
                                        <button type="button" className="btn btn-primary" onClick={handleUpdateUser} disabled={!isDetailsUserFormValid}>Update</button>
                                        {/* </Loading> */}
                                    </div>
                                </Loading>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage