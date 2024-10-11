import React from 'react';

const ProfilePage = () => {
    return (
        <>
            <div className="container profile-user" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className='row profile-user-box p-0'>
                    <div className="col-12 col-xs-12 col-sm-4 col-md-3 col-lg-3 profile-user-content-block">
                        <div className='detail-product-content-left bg'>
                            zz
                        </div>
                    </div>
                    <div className="col-12 col-xs-12 col-sm-8 col-md-9 col-lg-9 profile-user-content-block">
                        <div className='detail-product-content-right bg'>
                            <div class="row g-2">
                                <div className="form-floating mb-3">
                                    <input type="name" className="form-control" id="name" placeholder="name@example.com" />
                                    <label htmlFor="signUpName">Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="phone" className="form-control" id="phone" placeholder="name@example.com" />
                                    <label htmlFor="phone">Phone</label>
                                </div>
                                <div className="col-6 form-floating mb-3">
                                    <input type="email" className="form-control" id="email" placeholder="name@example.com" />
                                    <label htmlFor="email">Email address</label>
                                </div>
                                <div className="col-6 form-floating mb-3">
                                    <input type="password" className="form-control" id="password" placeholder="password" />
                                    <label htmlFor="password">Password</label>
                                </div>
                            </div>
                            {/* <Loading isLoading={isLoading}> */}
                            <div className='item-center'>
                                <button type="button" className="btn btn-primary">
                                    Update
                                </button>
                            </div>
                            {/* </Loading> */}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProfilePage;
