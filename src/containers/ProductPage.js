// src/containers/Main.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/User/ProductCard';
import Toolbar from '../components/User/Toolbar';
import Pagination from '../components/User/Pagination';

function rdimg() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

function ProductPage() {
    const products = [
        { id: 1, name: 'Product 1Product 1Product 1Product 1Prodguct 1Product 1Proguct 1Product 1', episode: '11', price: '100,000', image: rdimg() },
        { id: 2, name: 'Product 2', episode: '1', price: '200,000', image: rdimg() },
        { id: 3, name: 'Product 3', episode: '8', price: '300,000', image: rdimg() },
        { id: 4, name: 'Product 4', episode: '3', price: '400,000', image: rdimg() },
        { id: 5, name: 'Product 5', episode: '6', price: '500,000', image: rdimg() },
        { id: 6, name: 'Product 6', episode: '9', price: '600,000', image: rdimg() },
        { id: 7, name: 'Product 7', episode: '12', price: '700,000', image: rdimg() },
        { id: 8, name: 'Product 8', episode: '4', price: '800,000', image: rdimg() },
        { id: 9, name: 'Product 9', episode: '5', price: '900,000', image: rdimg() },
        { id: 10, name: 'Product 10', episode: '7', price: '1,000,000', image: rdimg() },
        { id: 11, name: 'Product 11', episode: '10', price: '1,100,000', image: rdimg() },
        { id: 12, name: 'Product 12', episode: '2', price: '1,200,000', image: rdimg() },
        { id: 13, name: 'Product 13', episode: '3', price: '1,300,000', image: rdimg() },
        { id: 14, name: 'Product 14', episode: '8', price: '1,400,000', image: rdimg() },
        { id: 15, name: 'Product 15', episode: '5', price: '1,500,000', image: rdimg() },
        { id: 16, name: 'Product 16', episode: '7', price: '1,600,000', image: rdimg() },
        { id: 17, name: 'Product 17', episode: '9', price: '1,700,000', image: rdimg() },
        { id: 18, name: 'Product 18', episode: '4', price: '1,800,000', image: rdimg() },
        { id: 19, name: 'Product 19', episode: '6', price: '1,900,000', image: rdimg() },
        { id: 20, name: 'Product 20', episode: '2', price: '2,000,000', image: rdimg() }
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
                        <Pagination />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductPage;
