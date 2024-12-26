import React from 'react';
// import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import { Card } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';

const ProductCard = (props) => {
    const { stock, description, image, name, price, rating, type, id, sold, xsSize = 6, smSize = 4, mdSize = 3, lgSize = 3 } = props

    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product/details/${id}`)
    }

    return (
        <Col xs={xsSize} sm={smSize} md={mdSize} lg={lgSize} className="product">
            <Card className='product-card' onClick={() => handleDetailsProduct(id)}>
                <Card.Img variant="top" src={image} className='product-card-img' alt={name} />
                <Card.Body className='product-card-body'>
                    <Card.Text className="product-card-title">{name}</Card.Text>
                    <div className='product-card-block'>
                        <Card.Text className="product-card-price">
                            {price} VND
                        </Card.Text>
                        <Card.Text className='product-card-sold'>sold: {sold}</Card.Text>
                        {/* <Badge bg="secondary" className='product-card-episode'>
                        Eps {product.episode}
                    </Badge> */}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProductCard;