import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import { getBase64 } from '../../utils'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import * as ProductService from '../../services/ProductService.js'
import * as message from "../../components/Message/Message.js";
import { useMutationHooks } from '../../hooks/useMutationHook.js';
import Loading from '../../components/Loading/Loading.js'
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js"
function AdminProduct() {
    const [stateProduct, setStateProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        description: ''
    })

    const mutation = useMutationHooks(
        async (data) => {
            const { name, image, type, price, countInStock, description } = data
            const res = await ProductService.createProduct({ name, image, type, price, countInStock, description })
            return res
        }
    )
    const { data, isSuccess, isError } = mutation
    const isLoading = mutation.isPending


    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Product added successfully!');
            handleCancel()
        } else if (isError || (isSuccess && data?.status === 'ERR')) {
            message.error(data?.message);
        }
    }, [data, isSuccess, isError]);

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleCancel = () => {
        Modal.getInstance(document.getElementById('exampleModal')).hide()
        setStateProduct({
            name: '',
            image: '',
            type: '',
            price: '',
            countInStock: '',
            description: ''
        })
    }
    const createProduct = () => {
        mutation.mutate(stateProduct)
    }

    const handleOnChangeProduct = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await getBase64(file)
            setStateProduct({
                ...stateProduct,
                image: preview
            })
        }
    }

    const beforeUpload = (file) => {
        return false
    }

    const isFormValid = stateProduct.name !== '' && stateProduct.image !== '' && stateProduct.type !== '' && stateProduct.price !== '' && stateProduct.countInStock !== ''

    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Product management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-product-add-product">
                    <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add product
                    </button>
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Add product</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="body">
                                        <div className="row">
                                            <div className="form-floating mb-3 col-12">
                                                <Upload beforeUpload={beforeUpload} onChange={handleOnChangeProduct} showUploadList={false} maxCount={1}>
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
                                        <button type="button" className="btn btn-primary" onClick={createProduct} disabled={!isFormValid}>Add</button>
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TableComponent />
            </div>
        </>
    )
}

export default AdminProduct
