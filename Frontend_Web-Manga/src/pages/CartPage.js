import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } from '../redux/orderSlide'
import { convertPrice } from '../utils'
import { useNavigate } from 'react-router-dom'
import { Modal as BootstrapModal } from 'bootstrap'
import { useMutationHooks } from '../hooks/useMutationHook'
import * as UserService from '../services/UserService'
import Loading from '../components/Loading/Loading'
import * as message from "../components/Message/Message"
import { updateUser } from '../redux/userSlide'
import Step from '../components/User/Step'

const CartPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

    const [listChecked, setListChecked] = useState([])
    const [currentStep, SetCurrentStep] = useState(0)
    const dispatch = useDispatch()

    const [stateDetailsUser, setStateDetailsUser] = useState({
        name: '',
        phone: '',
        address: ''
    })

    const decreaseQuantity = (idProduct) => {
        dispatch(decreaseAmount({ idProduct }))
    }
    const increaseQuantity = (idProduct, limited) => {
        if (!limited)
            dispatch(increaseAmount({ idProduct }))
    }
    const handleChange = (e) => {
        // const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
        // setQuantity(value)
    }

    const handleOnChangeCheck = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    }

    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product/details/${id}`)
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

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }))
        if (listChecked.length > 0)
            SetCurrentStep(1)
        else
            SetCurrentStep(0)
    }, [listChecked])

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))

    }
    const handleRemoveAllOrderProduct = () => {
        if (listChecked?.length > 0) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }


    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])
    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount * cur.amount) / 100)
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

    const handlePayment = () => {
        if (!user.id)
            navigate('/signin')
        else
            if (!user?.phone || !user?.address || !user?.name) {
                const modalUpdateInfoElement = document.getElementById('modalUpdateInfo')
                if (modalUpdateInfoElement) {
                    const modalUpdateInfoInstance = BootstrapModal.getOrCreateInstance(modalUpdateInfoElement)
                    if (modalUpdateInfoInstance) {
                        setStateDetailsUser({
                            name: user?.name,
                            address: user?.address,
                            phone: user?.phone
                        })
                        modalUpdateInfoInstance.show()
                    }
                }
            }
            else {
                navigate('/payment')
            }
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
            await UserService.updateUser(id, rests, access_token)
        }
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const isLoadingUpdated = mutationUpdate.isPending

    const handleOnchangeDetails = (e) => {
        setStateDetailsUser({
            ...stateDetailsUser,
            [e.target.name]: e.target.value
        })
    }
    const handleUpdateUser = () => {
        const { name, address, phone } = stateDetailsUser
        if (name && address && phone) {
            mutationUpdate.mutate({ id: user?.id, ...stateDetailsUser, access_token: user?.access_token })
        }
    }
    useEffect(() => {
        if (user) {
            setStateDetailsUser({
                name: user?.name || '',
                phone: user?.phone || '',
                address: user?.address || ''
            })
        }
    }, [user])

    useEffect(() => {
        if (isSuccessUpdated) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
            handleCancel()
        }
        else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated])

    const handleGetDetailsUser = async (id, access_token) => {
        const res = await UserService.getDetailsUser(id, access_token)
        dispatch(updateUser({ ...res?.data, access_token: access_token }))
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
                        <div className='col-8 cart-item-block'>
                            <div className='col-12 cart-item-header-block p-0' >
                                <div className='cart-item-header-inner bg'>
                                    <div className='row timeline-step m-0'>
                                        <Step current={currentStep} />
                                    </div>
                                    <span className='item-center'>
                                        <hr style={{ width: '95%' }} />
                                    </span>
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
                                            {listChecked?.length > 0 ? (
                                                <i className="fas fa-trash-can" onClick={handleRemoveAllOrderProduct} style={{ cursor: 'pointer' }}></i>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='cart-item-inner bg'>
                                {order?.orderItems?.map((orderItem) => {
                                    return (
                                        <div className='row cart-item-product' key={orderItem.product}>
                                            <div className='col-1 cart-product-check'>
                                                <input className="form-check-input" checked={listChecked.includes(orderItem.product)} onChange={handleOnChangeCheck} type="checkbox" value={orderItem.product} aria-label="..." />
                                            </div>
                                            <div className='col-2 cart-product-img p-0'>
                                                <img src={orderItem.image} alt='img' onClick={() => handleDetailsProduct(orderItem.product)} />
                                            </div>
                                            <div className='col-8 row cart-product-group-info p-0'>
                                                <div className='col-6 cart-product-info p-0'>
                                                    <div className='cart-product-title'>
                                                        <h5>{orderItem.name}</h5>
                                                    </div>
                                                    <div className='cart-product-price-original'>
                                                        <h6>{convertPrice(orderItem.price)} VND</h6>
                                                    </div>
                                                </div>
                                                <div className='col-6 row cart-product-number p-0'>
                                                    <div className='col-6 item-center p-0'>
                                                        <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                            <button type="button" className="btn btn-outline-secondary" onClick={() => decreaseQuantity(orderItem.product)}>
                                                                <i className="fas fa-minus"></i>
                                                            </button>
                                                            <input type="number" className="form-control text-center btn btn-outline-secondary disabled" onChange={handleChange} value={orderItem.amount} min="1" max={orderItem.stock} style={{ maxWidth: '35px', minWidth: '35px', color: 'black' }} />
                                                            <button type="button" className="btn btn-outline-secondary" onClick={() => increaseQuantity(orderItem.product, orderItem.amount === orderItem.stock)}>
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='col-6 cart-product-price-total p-0'>
                                                        <h6 className='m-0'><b>{convertPrice((orderItem.price * orderItem.amount))} VND</b></h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-1 cart-product-remove p-0'>
                                                <i className="fas fa-trash-can" onClick={() => handleDeleteOrder(orderItem.product)} style={{ cursor: 'pointer' }}></i>
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* <hr style={{ width: '95%', margin: '0 auto' }} /> */}
                            </div>

                        </div>

                        <div className='col-4'>
                            <div className=' cart-total-block p-0'>
                                <div className='cart-total-inner bg'>
                                    <div className='cart-total'>
                                        <div>
                                            <p>Address</p>
                                        </div>
                                        <div className='cart-total-number'>
                                            <p><b>{user?.address}</b></p>
                                        </div>
                                        <div style={{ cursor: 'pointer' }}>
                                            <p onClick={handleChangeAddress}><b>Change</b></p>
                                        </div>
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
                                    {listChecked?.length > 0 ? (
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            className="btn btn-danger cart-payment-btn btn-lg">
                                            Proceed to Payment
                                        </button>

                                    ) : (
                                        <button type="button" style={{ cursor: 'not-allowed' }} className="btn btn-secondary cart-payment-btn btn-lg">Proceed to Payment</button>
                                    )}
                                </div>
                            </div>
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

export default CartPage