import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductCard from '../components/User/ProductCard'
import Toolbar from '../components/User/Toolbar'
import { Pagination } from 'antd'
import * as ProductService from '../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading/Loading'
import { useQuery } from '@tanstack/react-query'
import { convertPrice } from '../utils'

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const [typeProducts, setTypeProducts] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0
    })
    const [visibleTypes, setVisibleTypes] = useState(6)

    const fetchAllProduct = async (context) => {
        const limit = context.queryKey[1]
        const search = context.queryKey[2]
        const types = context.queryKey[3] || []
        const page = context.queryKey[4]

        const res = await ProductService.getAllProduct(search, types, limit, page)

        if (res?.status === 'OK') {
            setPagination((prev) => ({
                ...prev,
                total: search.length > 0 ? res?.data?.length : res?.totalProduct,
                // total: res?.totalFilteredProduct || res?.data?.length || 0,
                // total: res?.totalFilteredProduct || (search.length > 0 ? res?.data?.length : res?.totalProduct) || 0,

            }))
            return res?.data || []
        }
        return []
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        setTypeProducts(res?.data)
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const { isLoading, data: products = [] } = useQuery({
        queryKey: ['products', pagination.limit, searchProduct, selectedTypes, pagination.page],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        enabled: !!pagination.limit,
    })

    useEffect(() => {
        if (searchProduct.length > 0) {
            setPagination((prev) => ({
                ...prev,
                page: 1
            }))
        }
    }, [searchProduct])

    const handleTypeChange = (type) => {
        setPagination((prev) => ({
            ...prev,
            page: 1
        }))
        setSelectedTypes((prevTypes) => {
            const newTypes = prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
            return newTypes
        })
    }

    const onShowSizeChange = (current, pageSize) => {
        setPagination({ ...pagination, page: current, limit: pageSize })
    }

    const onPageChange = (page) => {
        setPagination({ ...pagination, page })
    }

    const handleShowMoreTypes = () => {
        setVisibleTypes(typeProducts.length)
    }

    const handleShowLessTypes = () => {
        setVisibleTypes(6)
    }

    return (
        <>
            <nav style={{ '--bs-breadcrumb-divider': '>' }} aria-label="breadcrumb">
                <ol className="breadcrumb m-0" style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <li className="breadcrumb-item">
                        <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
                            <b>Home</b>
                        </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">&gt; Product</li>
                </ol>
            </nav>

            <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
                <Row className='block-content'>
                    <Col xs={12} sm={12} md={12} lg={3} className='sidebar-box'>
                        <div className='bg'>
                            <div className='sidebar'>
                                <p style={{ fontSize: '18px', fontWeight: 'bolder', marginBottom: '5px' }}>Genres</p>
                                <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
                                    <Row>
                                        {typeProducts?.slice(0, visibleTypes).map((item) => (
                                            <Col xs={6} sm={4} md={3} lg={6} key={item} style={{ padding: '0px' }}>
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${item}`}
                                                    checked={selectedTypes.includes(item)}
                                                    onChange={() => handleTypeChange(item)}
                                                />
                                                <label htmlFor={`checkbox-${item}`} style={{ fontSize: '14px', marginLeft: '5px' }}>
                                                    {item}
                                                </label>
                                            </Col>
                                        ))}
                                    </Row>
                                </Container>
                                <div className='item-center'>
                                    {visibleTypes < typeProducts.length ? (
                                        <button onClick={handleShowMoreTypes} className='btn btn-outline-warning mt-2'>
                                            See More
                                        </button>
                                    ) : (
                                        <button onClick={handleShowLessTypes} className='btn btn-warning mt-2'>
                                            See Less
                                        </button>
                                    )}
                                </div>
                            </div>
                            <hr style={{ width: '90%', margin: '0 auto' }} />
                            <div className='sidebar'>
                                <p style={{ fontSize: '18px', fontWeight: 'bolder', marginBottom: '5px' }}>Price</p>
                            </div>
                            <hr style={{ width: '90%', margin: '0 auto' }} />
                            <div className='sidebar'>
                                <p style={{ fontSize: '18px', fontWeight: 'bolder', marginBottom: '5px' }}>Suppliers</p>
                            </div>
                            <hr style={{ width: '90%', margin: '0 auto' }} />
                            <div className='sidebar'>
                                <p style={{ fontSize: '18px', fontWeight: 'bolder', marginBottom: '5px' }}>Form</p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={9} className='product-box'>
                        <div className='bg'>
                            <Toolbar />
                            <Loading isLoading={isLoading}>
                                <Row className="products">
                                    {products?.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            stock={product.stock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={convertPrice(product.price)}
                                            rating={product.rating}
                                            type={product.type}
                                            id={product._id}
                                        />
                                    ))}
                                </Row>
                                <Pagination
                                    align="center"
                                    onShowSizeChange={onShowSizeChange}
                                    onChange={onPageChange}
                                    current={pagination?.page}
                                    pageSize={pagination?.limit}
                                    total={pagination?.total}
                                />
                            </Loading>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ProductPage
