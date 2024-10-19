import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/User/ProductCard';
import Toolbar from '../components/User/Toolbar';
import Pagination from '../components/User/Pagination';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as ProductService from '../services/ProductService.js'

function rdimg() {
    return `https://picsum.photos/800/900?random=${Math.floor(Math.random() * 1000)}`;
}

const ProductPage = () => {
    const fetchAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const { isLoading, data: products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
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
                        <Row className="products">
                            {products?.data?.map((product) => {
                                return <ProductCard
                                    key={product._id}
                                    countInStock={product.countInStock}
                                    description={product.description}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                />
                            })}
                        </Row>
                        <Pagination />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductPage;
