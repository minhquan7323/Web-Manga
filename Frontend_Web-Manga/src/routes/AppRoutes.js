import React from 'react';
import { Routes, Route } from "react-router-dom";
import App from '../App';
import Cart from '../pages/CartPage';
import DetailsProduct from '../pages/DetailsProductPage';
import Product from '../pages/ProductPage';
import Home from '../pages/HomePage';
import SignIn from '../pages/SignInPage';
import SignUp from '../pages/SignUpPage';
import Profile from '../pages/ProfilePage';
import Admin from '../pages/AdminPage';
import NotFound from '../pages/NotFoundPage';
import { useSelector } from 'react-redux';
import Payment from '../pages/PaymentPage';
import OrderSuccess from '../pages/OrderSuccessPage';
import MyOrder from '../pages/MyOrderPage';
import DetailsOrder from '../pages/DetailsOrderPage';

const AppRoutes = () => {
    const user = useSelector((state) => state.user)
    const isCheckAdmin = user.isAdmin

    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="product" element={<Product />} />
                <Route path="product/type/:type" element={<Product />} />
                <Route path="product/details/:id" element={<DetailsProduct />} />
                <Route path="cart" element={<Cart />} />
                <Route index element={<Home />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="payment" element={<Payment />} />
                <Route path="ordersuccess" element={<OrderSuccess />} />
                <Route path="myorder" element={<MyOrder />} />
                <Route path="detailsorder/:id" element={<DetailsOrder />} />
                <Route path="profileuser" element={<Profile />} />
                <Route path="system/admin" element={user && isCheckAdmin ? <Admin /> : <NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
export default AppRoutes;