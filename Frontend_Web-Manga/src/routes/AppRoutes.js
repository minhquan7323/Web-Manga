import React from 'react';
import { Routes, Route } from "react-router-dom";

import App from '../App';
import Cart from '../containers/CartPage';
import DetailProduct from '../containers/DetailProductPage';
import Product from '../containers/ProductPage';
import Home from '../containers/HomePage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="product" element={<Product />} />
                <Route path="product/:id" element={<DetailProduct />} />
                <Route path="cart" element={<Cart />} />
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
