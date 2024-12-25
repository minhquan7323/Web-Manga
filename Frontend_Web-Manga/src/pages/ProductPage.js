import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductCard from '../components/User/ProductCard'
import Toolbar from '../components/User/Toolbar'
import { Pagination } from 'antd'
import * as ProductService from '../services/ProductService'
import * as CategoryService from '../services/CategoryService'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading/Loading'
import { useQuery } from '@tanstack/react-query'
import { convertPrice } from '../utils'

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const [typeProducts, setTypeProducts] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [sortOrder, setSortOrder] = useState('')
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
        const sort = context.queryKey[5]

        const res = await ProductService.getAllProduct(search, types, limit, page, sort)

        if (res?.status === 'OK') {
            setPagination((prev) => {
                const newTotal = res?.totalProductFilter ?? res?.totalProduct
                const newPage = prev.page > Math.ceil(newTotal / prev.limit) ? 1 : prev.page
                return {
                    ...prev,
                    total: newTotal,
                    page: newPage,
                }
            })

            return res?.data
        }

        return []
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        const typesList = res?.data || []
        setTypeProducts(typesList)
    }

    const fetchAllCategories = async () => {
        const res = await CategoryService.getAllCategory()
        if (res?.status === 'OK') {
            const categoriesMap = res?.data.reduce((acc, category) => {
                acc[category._id] = category.name
                return acc
            }, {})
            return categoriesMap
        }
        return {}
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const { isLoading, data: products = [] } = useQuery({
        queryKey: ['products', pagination.limit, searchProduct, selectedTypes, pagination.page, sortOrder],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        enabled: !!pagination.limit,
    })

    const [categoriesMap, setCategoriesMap] = useState({})

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryData = await fetchAllCategories()
            setCategoriesMap(categoryData)
        }
        fetchCategories()
    }, [])

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

    const handleSortChange = (sort) => {
        setSortOrder(sort)
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
                                                    {categoriesMap[item] ? categoriesMap[item] : 'Unknown Category'}
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
                            <Toolbar onSortChange={handleSortChange} />
                            <Loading isLoading={isLoading}>
                                <Row className="products">
                                    {products?.length > 0 ? (
                                        products.map((product) => (
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
                                        ))
                                    ) : (
                                        <h1 className='item-center'>No products found</h1>
                                    )}
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
