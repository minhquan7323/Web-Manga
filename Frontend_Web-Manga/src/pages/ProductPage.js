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

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 100)
    const refSearch = useRef()
    const [loading, setLoading] = useState(false)
    const [stateProducts, setStateProducts] = useState([])

    const fetchAllProduct = async (search) => {
        setLoading(true)
        try {
            const res = await ProductService.getAllProduct(search)
            if (search.length > 0 || refSearch.current) {
                setStateProducts(res?.data)
            } else {
                setStateProducts([])
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (refSearch.current) {
            fetchAllProduct(searchDebounce)
        }
        refSearch.current = true
    }, [searchDebounce])

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
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={9} lg={9} className='product-box'>
                    <div className='bg'>
                        <Toolbar />
                        <Loading isLoading={loading}>
                            <Row className="products">
                                {stateProducts?.map((product) => {
                                    return <ProductCard
                                        key={product._id}
                                        countInStock={product.countInStock}
                                        description={product.description}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price.toLocaleString().replace(/,/g, '.')}
                                        rating={product.rating}
                                        type={product.type}
                                    />
                                })}
                            </Row>
                        </Loading>
                        <Pagination />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ProductPage
