// src/containers/Main.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/User/ProductCard';
import Toolbar from '../components/User/Toolbar';

function rdimg() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

function ProductPage() {
    const products = [
        { id: 1, name: 'Product 1Product 1Product 1Product 1Product 1Product 1Product 1Product 1', episode: '11', price: '100,000', image: rdimg() },
        { id: 2, name: 'Product 2', episode: '1', price: '200,000', image: rdimg() },
        { id: 3, name: 'Product 3', episode: '8', price: '300,000', image: rdimg() },
        { id: 4, name: 'Product 4', episode: '3', price: '400,000', image: rdimg() },
        { id: 5, name: 'Product 5', episode: '6', price: '500,000', image: rdimg() }
    ];

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
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductPage;
