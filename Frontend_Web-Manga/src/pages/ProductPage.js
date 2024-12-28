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
import Slider from '../components/User/Slider'

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const [typeProducts, setTypeProducts] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [sortOrder, setSortOrder] = useState('')
    const [priceFilter, setPriceFilter] = useState([0, 500000])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        total: 0
    })
    const [selectedBookCovers, setSelectedBookCovers] = useState([])
    const coverTypes = ["Paperback", "Hardback", "Boxset"];
    const [visibleTypes, setVisibleTypes] = useState(6)

    const fetchAllProduct = async (context) => {
        const limit = context.queryKey[1]
        const search = context.queryKey[2]
        const types = context.queryKey[3] || []
        const page = context.queryKey[4]
        const sort = context.queryKey[5]
        const price = context.queryKey[6]
        const cover = context.queryKey[7] || {}
        const res = await ProductService.getAllProduct(search, types, limit, page, sort, price, cover)

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
        if (res.status === 'OK') {
            const categories = res.data.categories
            const availableTypes = res.data.types
            const filteredTypes = categories.filter(category => availableTypes.includes(category._id))
            setTypeProducts(filteredTypes)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const { isLoading, data: products = [] } = useQuery({
        queryKey: ['products', pagination.limit, searchProduct, selectedTypes, pagination.page, sortOrder, priceFilter, selectedBookCovers],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        enabled: !!pagination.limit,
    })

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
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

    const handlePriceFilter = (value) => {
        setPriceFilter(value)
        setPagination((prev) => ({ ...prev, page: 1 }))
    }

    const handleBookCoverChange = (coverType) => {
        setPagination((prev) => ({
            ...prev,
            page: 1
        }))

        setSelectedBookCovers((prev) => {
            const newCovers = prev.includes(coverType)
                ? prev.filter((t) => t !== coverType)
                : [...prev, coverType]
            return newCovers
        })
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
                                        {typeProducts?.map((item) => (
                                            <Col xs={6} sm={4} md={3} lg={6} key={item._id} style={{ padding: '0px' }}>
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${item._id}`}
                                                    checked={selectedTypes.includes(item._id)}
                                                    onChange={() => handleTypeChange(item._id)}
                                                />
                                                <label htmlFor={`checkbox-${item._id}`} style={{ fontSize: '14px', marginLeft: '5px' }}>
                                                    {item.name}
                                                </label>
                                            </Col>
                                        ))}
                                    </Row>
                                </Container>
                                <div className='item-center'>
                                    {typeProducts.length > visibleTypes && (
                                        visibleTypes < typeProducts.length ? (
                                            <button onClick={handleShowMoreTypes} className='btn btn-outline-warning mt-2'>
                                                See More
                                            </button>
                                        ) : (
                                            <button onClick={handleShowLessTypes} className='btn btn-warning mt-2'>
                                                See Less
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                            <hr style={{ width: '90%', margin: '0 auto' }} />
                            <div className='sidebar'>
                                <p style={{ fontSize: '18px', fontWeight: 'bolder', marginBottom: '5px' }}>Price</p>
                                <div style={{ width: '90%', margin: 'auto' }}>
                                    <Slider
                                        step={1000}
                                        min={0}
                                        max={500000}
                                        defaultValue={[0, 500000]}
                                        onFilter={handlePriceFilter}
                                    />
                                </div>
                            </div>
                            <hr style={{ width: '90%', margin: '0 auto' }} />
                            <div className='sidebar'>
                                <p style={{ fontSize: '18px', fontWeight: 'bolder', marginBottom: '5px' }}>Book Cover</p>
                                <div>
                                    {coverTypes.map((cover) => (
                                        <div key={cover}>
                                            <input
                                                type="checkbox"
                                                id={cover}
                                                checked={selectedBookCovers.includes(cover)}
                                                onChange={() => handleBookCoverChange(cover)}
                                            />
                                            <label htmlFor={cover} style={{ fontSize: '14px', marginLeft: '5px' }}>
                                                {cover}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr style={{ width: '90%', margin: '0 auto' }} />
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
                                                sold={product.sold}
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
