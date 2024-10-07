import React from 'react';

function rdimg() {
    return `https://picsum.photos/1080?random=${Math.floor(Math.random() * 1000)}`;
}

const DetailProductPage = () => {
    return (
        <>
            <div className="container detail-product" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className='row detail-product-box p-0'>
                    <div className="col-12 col-xs-12 col-sm-5 col-md-5 col-lg-5 detail-product-content-block">
                        <div className='detail-product-content-left bg'>
                            <img src={rdimg()} alt='img' className='detail-product-img' />
                        </div>
                    </div>
                    <div className="col-12 col-xs-12 col-sm-7 col-md-7 col-lg-7 detail-product-content-block">
                        <div className='detail-product-content-right bg'>
                            <h3 className="fs-3">
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
                        </div>
                        <div className='detail-product-content-right bg'>
                            <h3 className="fs-3">
                                Details
                            </h3>
                            <div className='table-label'>
                                {/* table */}
                                <span>supplier: </span>
                                <span>NXBzzz</span>
                                <hr />
                                <span>supplier: </span>
                                <span>NXBzzz</span>
                                <hr />
                                <span>supplier: </span>
                                <span>NXBzzz</span>
                            </div>
                            <h1 className="fs-1 detail-product-price">
                                999999 đ
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailProductPage;
