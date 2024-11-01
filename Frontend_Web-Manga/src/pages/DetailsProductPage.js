import React, { useEffect, useState } from 'react'
import * as ProductService from '../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../components/Loading/Loading'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addOrderProduct } from '../redux/orderSlide'
import { convertPrice, initFacebookSDK } from '../utils'
import * as message from "../components/Message/Message"
import LikeFacebookButton from '../components/User/LikeFacebookButton'
import CommentFacebook from '../components/User/CommentFacebook'
const DetailsProductPage = () => {
    const { id: productId } = useParams()
    const user = useSelector((state) => state?.user)
    const order = useSelector((state) => state?.order)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1)
    const [limitOrder, setLimitOrder] = useState(false)

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }
    const increaseQuantity = () => {
        if (quantity < productDetails?.stock) {
            setQuantity(quantity + 1)
        }
    }
    const handleChange = (e) => {
        // const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
        // setQuantity(value)
    }

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails._id)
        if ((orderRedux?.amount + quantity) <= orderRedux?.stock || !orderRedux) {
            setLimitOrder(false)
        } else if (productDetails?.stock === 0) {
            setLimitOrder(true)
        }
    }, [quantity])

    const fetchGetDetailsProduct = async (productId) => {
        if (productId) {
            const res = await ProductService.getDetailsProduct(productId)
            return res.data
        }
    }

    const { data: productDetails = {}, isLoading } = useQuery({
        queryKey: ['details', productId],
        queryFn: () => fetchGetDetailsProduct(productId),
        enabled: !!productId,
    })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/signin', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + quantity) <= orderRedux?.stock || !orderRedux) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: quantity,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        stock: productDetails?.stock,
                    }
                }))

                message.success()
            } else {
                setLimitOrder(true)
                message.error()
            }
        }
    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    return (
        <Loading isLoading={isLoading}>
            <div className="container detail-product" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className="row detail-product-box p-0">
                    <div className="col-12 col-xs-12 col-sm-5 col-md-5 col-lg-5 detail-product-content-block">
                        <div className="detail-product-content-left bg">
                            <img src={productDetails?.image} alt="Product" className="detail-product-img" />
                            <div className="row sub-img-detail-product">
                                <div className="col-2">
                                    <img src={productDetails?.image} alt="img" className="detail-product-img" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xs-12 col-sm-7 col-md-7 col-lg-7 detail-product-content-block">
                        <div className="detail-product-content-right bg">
                            <h3>{productDetails?.name || 'Product Name'}</h3>
                            <div className="row">
                                <div className="col-6">
                                    Supplier: <span>{productDetails?.supplier || 'N/A'}</span>
                                </div>
                                <div className="col-6">
                                    Author: <span>{productDetails?.author || 'N/A'}</span>
                                </div>
                                <div className="col-6">
                                    Publisher: <span>{productDetails?.publisher || 'N/A'}</span>
                                </div>
                                <div className="col-6">
                                    Stock: <span>{productDetails?.stock || 'N/A'}</span>
                                </div>
                            </div>
                            <h2 className="detail-product-price" style={{ marginTop: '10px' }}>
                                {productDetails?.price ? `${convertPrice(productDetails.price)} VND` : 'N/A'}
                            </h2>
                            <LikeFacebookButton
                                dataHref={process.env.REACT_APP_IS_LOCAL ?
                                    'https://developers.facebook.com/docs/plugins/'
                                    : window.location.href}

                            />
                            <br />
                            <div className="row">
                                <div className="col-2">
                                    <b>Amount:</b>
                                </div>
                                <div className="col-5">
                                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                                        <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <input type="number" className="form-control text-center" value={quantity} onChange={handleChange} min="1" max={productDetails.stock} style={{ maxWidth: '55px', color: 'black' }} />
                                        <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-5 item-center">
                                    {limitOrder ? (
                                        <div style={{ color: 'red' }}>Out of stock</div>
                                    ) : (
                                        <button onClick={handleAddOrderProduct} type="button" className="btn btn-outline-danger">
                                            <i className="fa-solid fa-cart-shopping"></i> Add to cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="detail-product-content-right bg">
                            <h3>Details</h3>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td className="table-label">Supplier</td>
                                        <td>{productDetails?.supplier || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="table-label">Author</td>
                                        <td>{productDetails?.author || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="detail-product-content-right bg">
                            <h3>Description</h3>
                            <p>{productDetails?.description || ''}</p>
                        </div>
                    </div>
                    <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 detail-product-content-block">
                        <div className="detail-product-content-left bg">
                            <h3>Product reviews</h3>
                            <CommentFacebook dataHref={process.env.REACT_APP_IS_LOCAL ?
                                `https://yourwebsite.com/products/${productId}`
                                : window.location.href}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default DetailsProductPage
