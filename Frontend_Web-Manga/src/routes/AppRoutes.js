import React from 'react';
import { Routes, Route } from "react-router-dom";

import App from '../App';
import Cart from '../pages/CartPage';
import DetailProduct from '../pages/DetailProductPage';
import Product from '../pages/ProductPage';
import Home from '../pages/HomePage';
import SignIn from '../pages/SignInPage';
import SignUp from '../pages/SignUpPage';
import Profile from '../pages/ProfilePage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="product" element={<Product />} />
                <Route path="product/:id" element={<DetailProduct />} />
                <Route path="cart" element={<Cart />} />
                <Route index element={<Home />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="profileuser" element={<Profile />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
