import React from 'react';
import Col from 'react-bootstrap/Col';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Col xs={6} sm={4} md={3} lg={3} className="mb-3">
            <Card>
                <NavLink to={`/product/${product.id}`}>
                    <Card.Img variant="top" src={product.image} />
                </NavLink>
                <Card.Body>
                    <NavLink to={`/product/${product.id}`}>
                        <Card.Title className="product-title">{product.name}</Card.Title>
                    </NavLink>
                    <Card.Text className="product-price">
                        {product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProductCard;
