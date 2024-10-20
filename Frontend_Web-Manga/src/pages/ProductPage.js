import React, { useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/User/ProductCard';
import Toolbar from '../components/User/Toolbar';
import Pagination from '../components/User/Pagination';
import * as ProductService from '../services/ProductService';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading/Loading';
import { useDebounce } from '../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 100);
    const refSearch = useRef(false);
    const [limit, setLimit] = useState(12);

    const fetchAllProduct = async (context) => {
        const limit = context.queryKey[1];
        const search = searchDebounce || '';

        try {
            const res = await ProductService.getAllProduct(search, limit);
            return res?.data || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const { isLoading, data: products } = useQuery({
        queryKey: ['products', limit],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        enabled: !!limit,
    });

    return (
        <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
            <Row className='block-content'>
                <Col xs={12} sm={12} md={3} lg={3} className='sidebar-box'>
                    <div className='bg'>
                        <div className='sidebar'>
                            <h1>Side Bar</h1>
                            <h1>Side Bar</h1>
                            <h1>Side Bar</h1>
                            <h1>Side Bar</h1>
                            <h1>Side Bar</h1>
                            <h1>Side Bar</h1>
                            <h1>Side Bar</h1>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={9} lg={9} className='product-box'>
                    <div className='bg'>
                        <Toolbar />
                        <Loading isLoading={isLoading}>
                            <Row className="products">
                                {products?.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        countInStock={product.countInStock}
                                        description={product.description}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price.toLocaleString().replace(/,/g, '.')}
                                        rating={product.rating}
                                        type={product.type}
                                        id={product._id}
                                    />
                                ))}
                            </Row>
                        </Loading>
                        <Pagination />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductPage;
