import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/User/ProductCard';
import Toolbar from '../components/User/Toolbar';
import { Pagination } from 'antd';
import * as ProductService from '../services/ProductService';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading/Loading';
import { useQuery } from '@tanstack/react-query';

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const [typeProducts, setTypeProducts] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 4,
        total: 0
    });

    const fetchAllProduct = async (context) => {
        const limit = context.queryKey[1];
        const search = context.queryKey[2];
        const types = context.queryKey[3] || [];
        const page = context.queryKey[4];

        const res = await ProductService.getAllProduct(search, types, limit, page);
        if (res?.status === 'OK') {
            setPagination((prev) => ({
                ...prev,
                total: search.length > 0 ? res?.data?.length : res?.totalProduct,
            }));
            return res?.data || [];
        }
        return [];
    };

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        setTypeProducts(res?.data);
    };

    const { isLoading, data: products = [] } = useQuery({
        queryKey: ['products', pagination.limit, searchProduct, selectedTypes, pagination.page],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        enabled: !!pagination.limit,
    });

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    useEffect(() => {
        if (searchProduct.length > 0) {
            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));
        }
    }, [searchProduct]);

    const handleTypeChange = (type) => {
        setSelectedTypes((prevTypes) => {
            const newTypes = prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type];
            return newTypes;
        });
    };

    const onShowSizeChange = (current, pageSize) => {
        setPagination({ ...pagination, page: current, limit: pageSize });
    };

    const onPageChange = (page) => {
        setPagination({ ...pagination, page });
    };

    return (
        <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
            <Row className='block-content'>
                <Col xs={12} sm={12} md={12} lg={3} className='sidebar-box'>
                    <div className='bg'>
                        <div className='sidebar'>
                            <h1>Genres</h1>
                            {typeProducts?.map((item) => (
                                <div key={item} style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${item}`}
                                        checked={selectedTypes.includes(item)}
                                        onChange={() => handleTypeChange(item)}
                                    />
                                    <label htmlFor={`checkbox-${item}`} style={{ marginLeft: '8px' }}>
                                        {item}
                                    </label>
                                </div>
                            ))}
                            <div>
                                <button className='btn btn-danger'>Filter</button>
                            </div>
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
                                        price={product.price.toLocaleString().replace(/,/g, '.')}
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
    );
};

export default ProductPage;
