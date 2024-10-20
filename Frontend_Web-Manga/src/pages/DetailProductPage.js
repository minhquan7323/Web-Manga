import React, { useState } from 'react'
import * as ProductService from '../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../components/Loading/Loading'
import { useParams } from 'react-router-dom'

const DetailProductPage = () => {
    const { id: productId } = useParams()

    const [quantity, setQuantity] = useState(1)

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const increaseQuantity = () => {
        if (quantity < productDetails?.countInStock) {
            setQuantity(quantity + 1)
        }
    }

    const handleChange = (e) => {
        const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
        setQuantity(value)
    }

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
                            </div>
                            <h1 className="fs-1 detail-product-price">
                                {productDetails?.price ? `${productDetails.price.toLocaleString().replace(/,/g, '.')} đ` : 'N/A'}
                            </h1>
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
                                        <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={quantity} onChange={handleChange} min="1" max="10" style={{ maxWidth: '55px', color: 'black' }} />
                                        <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <button type="button" className="btn btn-outline-danger">
                                        <i className="fa-solid fa-cart-shopping"></i> Add to cart
                                    </button>
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
                            {/* <h6>{productDetails?.description || 'No description available.'}</h6> */}
                            <p>{productDetails?.description || ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default DetailProductPage
