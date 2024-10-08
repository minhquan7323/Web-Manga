import React, { useState } from 'react';

function rdimg() {
    return `https://picsum.photos/400?random=${Math.floor(Math.random() * 1000)}`;
}

const DetailProductPage = () => {
    const [quantity, setQuantity] = useState(1);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < 999) {
            setQuantity(quantity + 1);
        }
    };

    const handleChange = (e) => {
        const value = Math.max(1, Math.min(999, parseInt(e.target.value) || 1));
        setQuantity(value);
    };

    return (
        <>
            <div className="container detail-product" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className='row detail-product-box p-0'>
                    <div className="col-12 col-xs-12 col-sm-5 col-md-5 col-lg-5 detail-product-content-block">
                        <div className='detail-product-content-left bg'>
                            <img src={rdimg()} alt='img' className='detail-product-img' />
                            <div className='row sub-img-detail-product'>
                                <div className='col-2'>
                                    <img src={rdimg()} alt='img' className='detail-product-img' />
                                </div>
                                <div className='col-2'>
                                    <img src={rdimg()} alt='img' className='detail-product-img' />
                                </div>
                                <div className='col-2'>
                                    <img src={rdimg()} alt='img' className='detail-product-img' />
                                </div>
                                <div className='col-2'>
                                    <img src={rdimg()} alt='img' className='detail-product-img' />
                                </div>
                                <div className='col-2'>
                                    <img src={rdimg()} alt='img' className='detail-product-img' />
                                </div>
                                <div className='col-2'>
                                    <img src={rdimg()} alt='img' className='detail-product-img' />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-12 col-xs-12 col-sm-7 col-md-7 col-lg-7 detail-product-content-block">
                        <div className='detail-product-content-right bg'>
                            <h3>
                                Title Title Title Title Title Title Title Title Title Title Title
                            </h3>
                            <div className='row'>
                                <div className='col-6'>
                                    supplier: <span>NXBzzz</span>
                                </div>
                                <div className='col-6'>
                                    author: <span>NXBzzz</span>
                                </div>
                                <div className='col-6'>
                                    publisher: <span>NXBzzz</span>
                                </div>
                            </div>
                            <h1 className="fs-1 detail-product-price">
                                999999 đ
                            </h1>
                            <br></br>
                            <div className='row'>
                                <div className='col-2'>
                                    <b>Amount:</b>
                                </div>
                                <div className='col-5'>
                                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                                        <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <input type="number" className="form-control text-center btn btn-outline-secondary disabled" value={quantity} onChange={handleChange} min="1" max="999" style={{ maxWidth: '55px', color: 'black' }} />
                                        <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className='col-5'>
                                    <button type="button" className="btn btn-outline-danger">
                                        <i className="fa-solid fa-cart-shopping"></i> Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='detail-product-content-right bg'>
                            <h3>
                                Details
                            </h3>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td className='table-label'>supplier</td>
                                        <td>Markasddddddddddddddd</td>
                                    </tr>
                                    <tr>
                                        <td className='table-label'>author</td>
                                        <td>Jacob</td>
                                    </tr>
                                    <tr>
                                        <td className='table-label'>supplier</td>
                                        <td>Mark</td>
                                    </tr>
                                    <tr>
                                        <td className='table-label'>author</td>
                                        <td>Jacob</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='detail-product-content-right bg'>
                            <h3>
                                Description
                            </h3>
                            <h6>
                                Title Title Title Title Title Title Title Title Title Title Title
                            </h6>
                            <p>
                                Description DescriptionDescription Description
                                Description Description Description Description Description
                                Description DescriptionDescription Description
                                Description Description Description Description Description
                                Description DescriptionDescription Description
                                Description Description Description Description Description
                                Description DescriptionDescription Description
                                Description Description Description Description Description
                                Description DescriptionDescription Description
                                Description Description Description Description Description
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailProductPage;
