import Cart from '../pages/CartPage';
import DetailProduct from '../pages/DetailProductPage';
import Product from '../pages/ProductPage';
import Home from '../pages/HomePage';
import SignIn from '../pages/SignInPage';
import SignUp from '../pages/SignUpPage';
import Profile from '../pages/ProfilePage';
import Admin from '../pages/AdminPage';
import NotFound from '../pages/NotFoundPage';
export const routes = [
    {
        path: '/',
        page: Home
    },
    {
        path: '/product',
        page: Product
    },
    {
        path: '/product/:id',
        page: DetailProduct
    },
    {
        path: '/signin',
        page: SignIn
    },
    {
        path: '/signup',
        page: SignUp
    },
    {
        path: '/profileuser',
        page: Profile
    },
    {
        path: '/system/admin',
        page: Admin
    }
]