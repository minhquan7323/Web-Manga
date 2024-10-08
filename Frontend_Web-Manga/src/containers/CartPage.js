import React, { useState } from 'react';

const CartPage = () => {
    const [quantity, setQuantity] = useState(1);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);
        }
    };

    const handleChange = (e) => {
        const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
        setQuantity(value);
    };

    function rdimg() {
        return `https://picsum.photos/400/100?random=${Math.floor(Math.random() * 1000)}`;
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
                                        <input className="form-check-input m-0" type="checkbox" value="" aria-label="..." />
                                    </div>
                                    <div className='col-2 p-0'>
                                        Select all
                                    </div>
                                    <div className='col-8 row item-center p-0'>
                                        <div className='col-7'>
                                        </div>
                                        <div className='col-5 row p-0' >
                                            <div className='col-6 item-center p-0'>
                                                Amount
                                            </div>
                                            <div className='col-6 item-center p-0'>
                                                Total amount
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-1 p-0'>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-8 cart-item-block'>

                            <div className='cart-item-inner bg'>
                                <div className='row cart-item-product'>
                                    <div className='col-1 cart-product-check'>
                                        <input className="form-check-input" type="checkbox" value="" aria-label="..." />
                                    </div>
                                    <div className='col-2 cart-product-img p-0'>
                                        <img src={rdimg()} alt='img' />
                                    </div>
                                    <div className='col-8 row cart-product-group-info p-0'>
                                        <div className='col-7 cart-product-info p-0'>
                                            <div className='cart-product-title'>
                                                <h4>title</h4>
                                            </div>
                                            <div className='cart-product-price-original'>
                                                <h6>33000 VND</h6>
                                            </div>
                                        </div>
                                        <div className='col-5 row cart-product-number p-0'>
                                            <div className='col-6 item-center p-0'>
                                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={quantity} onChange={handleChange} min="1" max="10" style={{ maxWidth: '35px', minWidth: '35px', color: 'black' }} />
                                                    <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='col-6 cart-product-price-total p-0'>
                                                <h6 className='m-0'><b>150000 VND</b></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-1 cart-product-remove p-0'>
                                        <i className="fas fa-trash-can"></i>
                                    </div>
                                </div>
                                <hr style={{ width: '95%', margin: '0 auto' }} />
                                <div className='row cart-item-product'>
                                    <div className='col-1 cart-product-check'>
                                        <input className="form-check-input" type="checkbox" value="" aria-label="..." />
                                    </div>
                                    <div className='col-2 cart-product-img p-0'>
                                        <img src={rdimg()} alt='img' />
                                    </div>
                                    <div className='col-8 row cart-product-group-info p-0'>
                                        <div className='col-7 cart-product-info p-0'>
                                            <div className='cart-product-title'>
                                                <h4>title</h4>
                                            </div>
                                            <div className='cart-product-price-original'>
                                                <h6>33000 VND</h6>
                                            </div>
                                        </div>
                                        <div className='col-5 row cart-product-number p-0'>
                                            <div className='col-6 item-center p-0'>
                                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={quantity} onChange={handleChange} min="1" max="10" style={{ maxWidth: '35px', minWidth: '35px', color: 'black' }} />
                                                    <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='col-6 cart-product-price-total p-0'>
                                                <h6 className='m-0'><b>150000 VND</b></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-1 cart-product-remove p-0'>
                                        <i className="fas fa-trash-can"></i>
                                    </div>
                                </div>
                                <hr style={{ width: '95%', margin: '0 auto' }} />
                                <div className='row cart-item-product'>
                                    <div className='col-1 cart-product-check'>
                                        <input className="form-check-input" type="checkbox" value="" aria-label="..." />
                                    </div>
                                    <div className='col-2 cart-product-img p-0'>
                                        <img src={rdimg()} alt='img' />
                                    </div>
                                    <div className='col-8 row cart-product-group-info p-0'>
                                        <div className='col-7 cart-product-info p-0'>
                                            <div className='cart-product-title'>
                                                <h4>title</h4>
                                            </div>
                                            <div className='cart-product-price-original'>
                                                <h6>33000 VND</h6>
                                            </div>
                                        </div>
                                        <div className='col-5 row cart-product-number p-0'>
                                            <div className='col-6 item-center p-0'>
                                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={quantity} onChange={handleChange} min="1" max="10" style={{ maxWidth: '35px', minWidth: '35px', color: 'black' }} />
                                                    <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='col-6 cart-product-price-total p-0'>
                                                <h6 className='m-0'><b>150000 VND</b></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-1 cart-product-remove p-0'>
                                        <i className="fas fa-trash-can"></i>
                                    </div>
                                </div>
                                <hr style={{ width: '95%', margin: '0 auto' }} />
                                <div className='row cart-item-product'>
                                    <div className='col-1 cart-product-check'>
                                        <input className="form-check-input" type="checkbox" value="" aria-label="..." />
                                    </div>
                                    <div className='col-2 cart-product-img p-0'>
                                        <img src={rdimg()} alt='img' />
                                    </div>
                                    <div className='col-8 row cart-product-group-info p-0'>
                                        <div className='col-7 cart-product-info p-0'>
                                            <div className='cart-product-title'>
                                                <h4>title</h4>
                                            </div>
                                            <div className='cart-product-price-original'>
                                                <h6>33000 VND</h6>
                                            </div>
                                        </div>
                                        <div className='col-5 row cart-product-number p-0'>
                                            <div className='col-6 item-center p-0'>
                                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={quantity} onChange={handleChange} min="1" max="10" style={{ maxWidth: '35px', minWidth: '35px', color: 'black' }} />
                                                    <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='col-6 cart-product-price-total p-0'>
                                                <h6 className='m-0'><b>150000 VND</b></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-1 cart-product-remove p-0'>
                                        <i className="fas fa-trash-can"></i>
                                    </div>
                                </div>
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
    );
}

export default CartPage;
