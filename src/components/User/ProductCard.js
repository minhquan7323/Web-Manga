import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Col xs={6} sm={4} md={3} lg={3} className="product">
            <Card className='product-card'>
                <NavLink to={`/product/${product.id}`}>
                    <Card.Img variant="top" src={product.image} className='product-card-img' />
                </NavLink>
                <Card.Body className='product-card-body'>
                    <NavLink to={`/product/${product.id}`}>
                        <Card.Text className="product-card-title">{product.name}</Card.Text>
                    </NavLink>
                    <Card.Text className="product-card-price">
                        {product.price}đ
                    </Card.Text>
                    <Badge bg="secondary">Eps {product.episode}</Badge>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProductCard;