import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import ProductCard from '../components/User/ProductCard'
import * as ProductService from '../services/ProductService.js'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading/Loading.js'
import { useQuery } from '@tanstack/react-query'
import { convertPrice } from '../utils.js';
import { Container } from 'react-bootstrap';

function rdimg() {
    return `https://picsum.photos/1500/600?random=${Math.floor(Math.random() * 1000)}`;
}

function HomePage() {
    const searchProduct = useSelector((state) => state?.product?.search)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(6)

    const fetchAllProduct = async (context) => {
        const limit = context.queryKey[1]
        const search = context.queryKey[2]
        const types = context.queryKey[3] || []

        let res
        if (types.length > 0 || (search && search.length > 0)) {
            res = await ProductService.getAllProduct(search, types, limit)
        } else {
            res = await ProductService.getAllProduct('', [], limit)
        }
        return res?.data || []
    }

    const { isLoading, data: products } = useQuery({
        queryKey: ['products', limit, searchProduct],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        enabled: !!limit,
    })

    return (
        <>
            <Carousel>
                <Carousel.Item interval={3500}>
                    <img src={rdimg()} className="d-block w-100" alt='img 1' />
                    {/* <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption> */}
                </Carousel.Item>
                <Carousel.Item interval={3500}>
                    <img src={rdimg()} className="d-block w-100" alt='img 2' />
                    {/* <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption> */}
                </Carousel.Item>
                <Carousel.Item interval={3500}>
                    <img src={rdimg()} className="d-block w-100" alt='img 3' />
                    {/* <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption> */}
                </Carousel.Item>
            </Carousel>

            <Loading isLoading={loading || isLoading}>
                <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
                    <Row className="products">
                        {products?.map((product) => {
                            return <ProductCard
                                key={product._id}
                                stock={product.stock}
                                description={product.description}
                                image={product.image}
                                name={product.name}
                                price={convertPrice(product.price)}
                                rating={product.rating}
                                type={product.type}
                                id={product._id}
                                sold={product.sold}
                                lgSize={2}
                                mdSize={3}
                                smSize={4}
                                xsSize={6}
                            />
                        })}
                    </Row>
                    {products?.length < limit ? (
                        null
                    ) : (
                        <div className='item-center'>
                            <button className='btn btn-primary' onClick={() => setLimit((prev) => prev + 6)} style={{ marginBottom: 10 }}>show more</button>
                        </div>

                    )}
                </Container>
            </Loading>
        </>
    );
}

export default HomePage;