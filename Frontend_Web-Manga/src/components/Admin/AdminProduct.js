import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import { getBase64 } from '../../utils'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import * as ProductService from '../../services/ProductService.js'
import * as message from "../Message/Message.js"
import { useMutationHooks } from '../../hooks/useMutationHook.js'
import Loading from '../Loading/Loading.js'
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"

function AdminProduct() {
    const [stateProduct, setStateProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        description: ''
    })
    const [stateDetailsProduct, setStateDetailsProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        description: ''
    })
    const [rowSelected, setRowSelected] = useState('')
    const user = useSelector((state) => state?.user)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const mutation = useMutationHooks(
        async (data) => {
            const { name, image, type, price, countInStock, description } = data
            const res = await ProductService.createProduct({ name, image, type, price, countInStock, description })
            return res
        }
    )
    const { data, isSuccess, isError } = mutation
    const isLoading = mutation.isPending

    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await ProductService.updateProduct(id, rests, access_token)
            return res
        }
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const isLoadingUpdated = mutationUpdate.isPending

    const mutationDelete = useMutationHooks(
        async (data) => {
            const { id, access_token } = data
            const res = await ProductService.deleteProduct(id, access_token)
            return res
        }
    )
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const isLoadingDeleted = mutationDelete.isPending

    const fetchAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const fetchGetDetailsProduct = async (rowSelected) => {
        setIsLoadingDetails(true)

        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateDetailsProduct({
                name: res.data.name,
                image: res.data.image,
                type: res.data.type,
                price: res.data.price,
                countInStock: res.data.countInStock,
                description: res.data.description
            })
        }
        setIsLoadingDetails(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])

    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
    })
    const { isLoading: isLoadingProducts, data: products } = queryProduct

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <div className="admin-table-name">{text}</div>,
            width: 100,
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Image',
            dataIndex: 'image',
            width: 50,
            render: (text) => <img src={text} alt="img" />,
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Quantity',
            dataIndex: 'countInStock',
            sorter: (a, b) => a.countInStock - b.countInStock
        },
        {
            title: 'action',
            dataIndex: 'action',
            fixed: 'right',
            width: 50,
            render: (_, record) => (
                <div className="admin-table-action">
                    <span
                        data-bs-toggle="modal"
                        data-bs-target="#modalDelete">
                        <i className="fas fa-trash"></i>
                    </span>
                    <span
                        onClick={() => {
                            setRowSelected(record._id);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalEdit">
                        <i className="fas fa-edit"></i>
                    </span>
                </div>
            )
        }
    ]

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [data, isSuccess, isError])
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [dataUpdated, isSuccessUpdated, isErrorUpdated])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [dataDeleted, isSuccessDeleted, isErrorDeleted])

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeDetails = (e) => {
        setStateDetailsProduct({
            ...stateDetailsProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleCancel = () => {
        const modalAddElement = document.getElementById('modalAdd');
        const modalEditElement = document.getElementById('modalEdit');
        const modalDeleteElement = document.getElementById('modalDelete');

        if (modalAddElement) {
            const modalAddInstance = Modal.getInstance(modalAddElement);
            if (modalAddInstance) {
                modalAddInstance.hide();
            }
        }
        if (modalEditElement) {
            const modalEditInstance = Modal.getInstance(modalEditElement);
            if (modalEditInstance) {
                modalEditInstance.hide();
            }
        }
        if (modalDeleteElement) {
            const modalDeleteInstance = Modal.getInstance(modalDeleteElement);
            if (modalDeleteInstance) {
                modalDeleteInstance.hide();
            }
        }

        setStateProduct({
            name: '',
            image: '',
            type: '',
            price: '',
            countInStock: '',
            description: ''
        })
    }
    useEffect(() => {
        const modalElement = document.getElementById('modalAdd')
        const handleModalHidden = () => {
            handleCancel()
        }
        modalElement.addEventListener('hidden.bs.modal', handleModalHidden)
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalHidden)
        }
    }, [])

    const createProduct = () => {
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const updateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateDetailsProduct, access_token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const deleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, access_token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChangeImage = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await getBase64(file)
            setStateProduct({
                ...stateProduct,
                image: preview
            })
        }
    }
    const handleOnChangeImageDetails = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await getBase64(file)
            setStateDetailsProduct({
                ...stateDetailsProduct,
                image: preview
            })
        }
    }
    const beforeUpload = (file) => {
        return false
    }

    const isProductFormValid = stateProduct.name !== '' && stateProduct.image !== '' && stateProduct.type !== '' && stateProduct.price !== '' && stateProduct.countInStock !== ''
    const isDetailsProductFormValid = stateDetailsProduct.name !== '' && stateDetailsProduct.image !== '' && stateDetailsProduct.type !== '' && stateDetailsProduct.price !== '' && stateDetailsProduct.countInStock !== '';

    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Product management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-product-add-product">
                    <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalAdd">
                        Add product
                    </button>

                    <div className="modal fade" id="modalAdd" tabIndex="-1" aria-labelledby="modalAdd" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalAdd">Add product</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="body">
                                        <div className="row">
                                            <div className="form-floating mb-3 col-12">
                                                <Upload beforeUpload={beforeUpload} onChange={handleOnChangeImage} showUploadList={false} maxCount={1}>
                                                    <Button icon={<UploadOutlined />}>Image</Button>
                                                </Upload>
                                                {stateProduct?.image && (
                                                    <img src={stateProduct?.image} />
                                                )}
                                            </div>
                                            <div className="form-floating mb-3 col-8">
                                                <input type="name" className="form-control" id="name" placeholder="name" value={stateProduct.name} name="name" onChange={handleOnchange} required />
                                                <label htmlFor="name">Name</label>
                                            </div>
                                            <div className="form-floating mb-3 col-4">
                                                <input type="countInStock" className="form-control" id="countInStock" placeholder="countInStock" value={stateProduct.countInStock} name="countInStock" onChange={handleOnchange} required />
                                                <label htmlFor="countInStock">Quantity</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="type" className="form-control" id="type" placeholder="type" value={stateProduct.type} name="type" onChange={handleOnchange} required />
                                                <label htmlFor="type">Type</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="price" className="form-control" id="price" placeholder="price" value={stateProduct.price} name="price" onChange={handleOnchange} required />
                                                <label htmlFor="price">Price</label>
                                            </div>
                                            <div className="form-floating mb-3 col-12">
                                                <textarea type="description" className="form-control" id="description" placeholder="description" value={stateProduct.description} name="description" onChange={handleOnchange} />
                                                <label htmlFor="description">Description</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                    <Loading isLoading={isLoading}>
                                        <button type="button" className="btn btn-primary" onClick={createProduct} disabled={!isProductFormValid}>Add</button>
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="modalEdit" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalEdit">Edit product</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <Loading isLoading={isLoadingDetails}>

                                    <div className="modal-body">
                                        <div className="body">
                                            <div className="row">
                                                <div className="form-floating mb-3 col-12">
                                                    <Upload beforeUpload={beforeUpload} onChange={handleOnChangeImageDetails} showUploadList={false} maxCount={1}>
                                                        <Button icon={<UploadOutlined />}>Image</Button>
                                                    </Upload>
                                                    {stateDetailsProduct?.image && (
                                                        <img src={stateDetailsProduct?.image} alt="Product" />
                                                    )}
                                                </div>
                                                <div className="form-floating mb-3 col-8">
                                                    <input type="name" className="form-control" id="name" placeholder="name" value={stateDetailsProduct.name} name="name" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="name">Name</label>
                                                </div>
                                                <div className="form-floating mb-3 col-4">
                                                    <input type="countInStock" className="form-control" id="countInStock" placeholder="countInStock" value={stateDetailsProduct.countInStock} name="countInStock" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="countInStock">Quantity</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="type" className="form-control" id="type" placeholder="type" value={stateDetailsProduct.type} name="type" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="type">Type</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="price" className="form-control" id="price" placeholder="price" value={stateDetailsProduct.price} name="price" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="price">Price</label>
                                                </div>
                                                <div className="form-floating mb-3 col-12">
                                                    <textarea type="description" className="form-control" id="description" placeholder="description" value={stateDetailsProduct.description} name="description" onChange={handleOnchangeDetails} />
                                                    <label htmlFor="description">Description</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                        <Loading isLoading={isLoadingUpdated}>
                                            <button type="button" className="btn btn-primary" onClick={updateProduct} disabled={!isDetailsProductFormValid}>Edit</button>
                                        </Loading>
                                    </div>
                                </Loading>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="modalDelete" tabIndex="-1" aria-labelledby="modalDelete" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalDelete">Delete product</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="body">
                                        <div>Are you sure you want to delete this product?</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                    <Loading isLoading={isLoadingDeleted}>
                                        <button type="button" className="btn btn-danger" onClick={deleteProduct}>Delete</button>
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TableComponent
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingProducts}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id);
                            }
                        };
                    }} />
            </div>
        </>
    )
}

export default AdminProduct