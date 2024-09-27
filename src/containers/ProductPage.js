// src/containers/Main.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/User/ProductCard';

function rdimg() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

function ProductPage() {
    const products = [
        { id: 1, name: 'Product 1', price: '100,000', image: rdimg() },
        { id: 2, name: 'Product 2', price: '200,000', image: rdimg() },
        { id: 3, name: 'Product 3', price: '300,000', image: rdimg() },
        { id: 4, name: 'Product 4', price: '400,000', image: rdimg() },
        { id: 5, name: 'Product 5', price: '500,000', image: rdimg() }
    ];

    return (
        <Container className='ProductPage-container'>
            <Row>
                <Col xs={12} sm={12} md={3} lg={3} className='sidebar'>
                    Side Bar
                </Col>
                <Col xs={12} sm={12} md={9} lg={9} className='product item-inner'>
                    <Row>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductPage;
