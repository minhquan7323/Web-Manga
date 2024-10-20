import Carousel from 'react-bootstrap/Carousel';
import React, { useEffect, useRef, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductCard from '../components/User/ProductCard'
import Toolbar from '../components/User/Toolbar'
import Pagination from '../components/User/Pagination'
import * as ProductService from '../services/ProductService.js'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading/Loading.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { useQuery } from '@tanstack/react-query'

function rdimg() {
    return `https://picsum.photos/2000/800?random=${Math.floor(Math.random() * 1000)}`;
}
function HomePage() {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 100)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(4)

    const fetchAllProduct = async (context) => {
        const limit = context?.queryKey[1]
        const search = context?.queryKey[2]
        // setLoading(true)
        const res = await ProductService.getAllProduct(search, limit)
        // setLoading(false)
        return res
    }

    const { isLoading, data: products } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true
    })

    return (
        <>
            <Carousel>
                <Carousel.Item interval={3500}>
                    <img src={rdimg()} className="d-block w-100" alt='img 1' />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3500}>
                    <img src={rdimg()} className="d-block w-100" alt='img 2' />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3500}>
                    <img src={rdimg()} className="d-block w-100" alt='img 3' />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Loading isLoading={loading || isLoading}>
                <Row className="products">
                    {products?.data?.map((product) => {
                        return <ProductCard
                            key={product._id}
                            countInStock={product.countInStock}
                            description={product.description}
                            image={product.image}
                            name={product.name}
                            price={product.price.toLocaleString().replace(/,/g, '.')}
                            rating={product.rating}
                            type={product.type}
                            id={product._id}
                        />
                    })}
                </Row>
                <button onClick={() => setLimit((prev) => prev + 4)}>show more</button>
            </Loading>
        </>
    );
}

export default HomePage;