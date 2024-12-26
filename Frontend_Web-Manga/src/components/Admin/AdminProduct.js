import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import { resizeImage, sortByDate } from '../../utils'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import * as ProductService from '../../services/ProductService.js'
import * as CategoryService from '../../services/CategoryService.js'
import * as message from "../Message/Message.js"
import { useMutationHooks } from '../../hooks/useMutationHook.js'
import Loading from '../Loading/Loading.js'
import { Modal as BootstrapModal } from 'bootstrap'
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"

function AdminProduct() {
    const productTypes = ['Comedy', 'Shounen', 'Adventure', 'Drama', 'Action', 'Fantasy', 'Sci Fi', 'Slice Of Life', 'School Life', 'Supernatural', 'Seinen', 'Romance', 'Historical', 'Mystery', 'Non-Human Protagonists', 'Elemental', 'Powers', 'Mature', 'Tragedy', 'Family Friendly', 'Gender Bender', 'Shoujo', 'Sport', 'Psychological', 'Horror', 'Harem', 'Monsters', 'Ecchi', 'Josei', 'Shounen-Ai', 'Other']
    const [stateProduct, setStateProduct] = useState({
        name: '',
        image: '',
        type: [],
        price: '',
        stock: '',
        description: ''
    })
    const [stateDetailsProduct, setStateDetailsProduct] = useState({
        name: '',
        image: '',
        type: [],
        price: '',
        stock: '',
        description: ''
    })
    const [rowSelected, setRowSelected] = useState('')
    const user = useSelector((state) => state?.user)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const mutation = useMutationHooks(
        async (data) => {
            const { access_token, ...rests } = data
            const res = await ProductService.createProduct(rests, access_token)
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

    const mutationDeleteMany = useMutationHooks(
        async (data) => {
            const { access_token, ...ids } = data
            const res = await ProductService.deleteManyProducts(ids, access_token)
            return res
        }
    )
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany
    const isLoadingDeletedMany = mutationDeleteMany.isPending

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
                stock: res.data.stock,
                description: res.data.description
            })
        }
        setIsLoadingDetails(false)
    }

    const fetchAllCategory = async () => {
        const res = await CategoryService.getAllCategory()
        return res
    }

    const queryCategory = useQuery({
        queryKey: ['categories'],
        queryFn: fetchAllCategory,
        retry: 3,
        retryDelay: 1000,
    })
    const { isLoading: isLoadingCategories, data: categories } = queryCategory

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
            width: 150,
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
            width: 250,
            render: (types) => types.map(type => type.name).join(', ')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (price) => price.toLocaleString().replace(/,/g, '.')
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            sorter: (a, b) => a.stock - b.stock
        },
        {
            title: 'action',
            dataIndex: 'action',
            fixed: 'right',
            width: 50,
            render: (_, record) => (
                <div className="admin-table-action">
                    <span onClick={() => handleModalOpen('modalDelete')}>
                        <i className="fas fa-trash"></i>
                    </span>
                    <span onClick={() => {
                        handleModalOpen('modalEdit')
                        setRowSelected(record._id)
                    }}>
                        <i className="fas fa-edit"></i>
                    </span>
                </div>

            )
        }
    ]

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product, key: product._id, type: product.type
        }
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
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [dataDeletedMany, isSuccessDeletedMany, isErrorDeletedMany])

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
        const modalIds = ['modalAdd', 'modalEdit', 'modalDelete']

        modalIds.forEach(modalId => {
            const modalElement = document.getElementById(modalId)
            if (modalElement) {
                const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
                if (modalInstance) {
                    modalInstance.hide()
                }
            }
        })

        setStateProduct({
            name: '',
            image: '',
            type: '',
            price: '',
            stock: '',
            description: ''
        })
    }
    useEffect(() => {
        const modalDeleteElement = document.getElementById('modalDelete');

        if (modalDeleteElement) {
            const handleModalHidden = () => {
                handleCancel();
            };

            modalDeleteElement.addEventListener('hidden.bs.modal', handleModalHidden);

            return () => {
                modalDeleteElement.removeEventListener('hidden.bs.modal', handleModalHidden);
            };
        }
    }, [handleCancel]);
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

    const handleModalOpen = (modalType) => {
        const modalElement = document.getElementById(modalType)
        if (modalType === 'modalAdd' && modalElement) {
            const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
            if (modalInstance)
                modalInstance.show()
        }
        if (modalType === 'modalEdit' && modalElement) {
            const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
            if (modalInstance)
                modalInstance.show()
        }
        if (modalType === 'modalDelete' && modalElement) {
            const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
            if (modalInstance)
                modalInstance.show()
        }
    }

    const createProduct = () => {
        mutation.mutate({ ...stateProduct, access_token: user?.access_token }, {
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
    const deleteManyProducts = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, access_token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChangeImage = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await resizeImage(file, 1920, 1080, 0.7)
            setStateProduct({
                ...stateProduct,
                image: preview
            })
        }
    }

    const handleOnChangeImageDetails = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await resizeImage(file, 1920, 1080, 0.7)
            setStateDetailsProduct({
                ...stateDetailsProduct,
                image: preview
            })
        }
    }

    const beforeUpload = (file) => {
        return false
    }

    const isProductFormValid = stateProduct.name !== '' && stateProduct.image !== '' && stateProduct.type.length > 0 && stateProduct.price !== '' && stateProduct.stock !== ''
    const isDetailsProductFormValid = stateDetailsProduct.name !== '' && stateDetailsProduct.image !== '' && stateDetailsProduct.type.length > 0 && stateDetailsProduct.price !== '' && stateDetailsProduct.stock !== ''

    const handleCheckboxChange = (type) => {
        setStateProduct((prev) => {
            const isChecked = prev.type.includes(type)
            const newTypes = isChecked
                ? prev.type.filter(t => t !== type)
                : [...prev.type, type]
            return { ...prev, type: newTypes }
        })
    }

    const handleCheckboxChangeDetails = (e) => {
        const { value, checked } = e.target
        if (checked) {
            setStateDetailsProduct({
                ...stateDetailsProduct,
                type: [...stateDetailsProduct.type, { _id: value }]
            })
        } else {
            setStateDetailsProduct({
                ...stateDetailsProduct,
                type: stateDetailsProduct.type.filter(item => item._id !== value)
            })
        }
    }

    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Product management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-product-add-product">
                    <button type="button" onClick={() => handleModalOpen('modalAdd')} className="btn btn-outline-success">
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
                                            <div className="form-floating mb-3 col-12">
                                                <input type="name" className="form-control" id="name" placeholder="name" value={stateProduct.name} name="name" onChange={handleOnchange} required />
                                                <label htmlFor="name">Name</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="price" className="form-control" id="price" placeholder="price" value={stateProduct.price} name="price" onChange={handleOnchange} required />
                                                <label htmlFor="price">Price</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="stock" className="form-control" id="stock" placeholder="stock" value={stateProduct.stock} name="stock" onChange={handleOnchange} required />
                                                <label htmlFor="stock">Stock</label>
                                            </div>
                                            <b>Type</b>
                                            {categories?.data?.map((type) => (
                                                <div className="form-floating mb-0 col-md-6" key={type._id}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            id={`type-${type._id}`}
                                                            name="type"
                                                            value={type._id}
                                                            className="form-check-input"
                                                            checked={stateProduct?.type.includes(type._id)}
                                                            onChange={() => handleCheckboxChange(type._id)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`type-${type._id}`}>
                                                            {type.name}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
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
                                    <h1 className="modal-title fs-5" id="modalEdit">Update product</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="body">
                                        <Loading isLoading={isLoadingDetails}>
                                            <div className="row">
                                                <div className="form-floating mb-3 col-12">
                                                    <Upload beforeUpload={beforeUpload} onChange={handleOnChangeImageDetails} showUploadList={false} maxCount={1}>
                                                        <Button icon={<UploadOutlined />}>Image</Button>
                                                    </Upload>
                                                    {stateDetailsProduct?.image && (
                                                        <img src={stateDetailsProduct?.image} alt="Product" />
                                                    )}
                                                </div>
                                                <div className="form-floating mb-3 col-12">
                                                    <input type="name" className="form-control" id="name" placeholder="name" value={stateDetailsProduct.name} name="name" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="name">Name</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="price" className="form-control" id="price" placeholder="price" value={stateDetailsProduct.price} name="price" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="price">Price</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="stock" className="form-control" id="stock" placeholder="stock" value={stateDetailsProduct.stock} name="stock" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="stock">Stock</label>
                                                </div>
                                                <b>Type</b>
                                                {categories?.data?.map((type) => (
                                                    <div className="form-floating mb-0 col-md-6" key={type._id}>
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                id={`type-${type._id}`}
                                                                name="type"
                                                                value={type._id}
                                                                className="form-check-input"
                                                                checked={stateDetailsProduct?.type.some(item => item._id === type._id)}
                                                                onChange={(e) => handleCheckboxChangeDetails(e)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`type-${type._id}`}>
                                                                {type.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="form-floating mb-3 col-12">
                                                    <textarea type="description" className="form-control" id="description" placeholder="description" value={stateDetailsProduct.description} name="description" onChange={handleOnchangeDetails} />
                                                    <label htmlFor="description">Description</label>
                                                </div>
                                            </div>
                                        </Loading>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                    <Loading isLoading={isLoadingUpdated}>
                                        <button type="button" className="btn btn-primary" onClick={updateProduct} disabled={!isDetailsProductFormValid}>Edit</button>
                                    </Loading>
                                </div>
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
                    deleteMany={deleteManyProducts}
                    columns={columns}
                    data={sortByDate(dataTable)}
                    isLoading={isLoadingProducts}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                setRowSelected(record._id)
                            }
                        }
                    }} />
            </div>
        </>
    )
}

export default AdminProduct
