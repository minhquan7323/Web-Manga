import React from 'react';
// import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ProductCard = (props) => {
    const { countInStock, description, image, name, price, rating, type } = props
    return (
        <Col xs={6} sm={4} md={3} lg={3} className="product">
            <Card className='product-card'>
                {/* <NavLink to={`/product/${product._id}`}> */}
                <Card.Img variant="top" src={image} className='product-card-img' alt={name} />
                {/* </NavLink> */}
                <Card.Body className='product-card-body'>
                    {/* <NavLink to={`/product/${product._id}`}> */}
                    <Card.Text className="product-card-title">{name}</Card.Text>
                    {/* </NavLink> */}
                    <Card.Text className="product-card-price">
                        {price} đ
                    </Card.Text>
                    {/* <Badge bg="secondary" className='product-card-episode'>
                        Eps {product.episode}
                    </Badge> */}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProductCard;