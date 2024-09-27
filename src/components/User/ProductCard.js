// src/components/ProductCard/ProductCard.js
import React from 'react';
import Col from 'react-bootstrap/Col';

const ProductCard = ({ product }) => {
    return (
        <Col xs={6} sm={4} md={3} lg={3} className="item">
            <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <h3>{product.name}</h3>
                <p>{product.price} VND</p>
            </div>
        </Col>
    );
};

export default ProductCard;
