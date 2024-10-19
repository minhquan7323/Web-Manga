import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import { getBase64 } from '../../utils'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import * as UserService from '../../services/UserService.js'
import * as message from "../Message/Message.js"
import { useMutationHooks } from '../../hooks/useMutationHook.js'
import Loading from '../Loading/Loading.js'
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"

function AdminProduct() {
    const [stateUser, setStateUser] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [stateDetailsUser, setStateDetailsUser] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        avatar: '',
        address: '',
        isAdmin: ''
    })
    const [rowSelected, setRowSelected] = useState('')
    const user = useSelector((state) => state?.user)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const mutation = useMutationHooks(
        async (data) => {
            const { name, phone, email, password, confirmPassword } = data
            const res = await UserService.signUpUser({ name, phone, email, password, confirmPassword })
            return res
        }
    )
    const { data, isSuccess, isError } = mutation
    const isLoading = mutation.isPending

    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await UserService.updateUser(id, rests, access_token)
            return res
        }
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const isLoadingUpdated = mutationUpdate.isPending

    const mutationDelete = useMutationHooks(
        async (data) => {
            const { id, access_token } = data
            const res = await UserService.deleteUser(id, access_token)
            return res
        }
    )
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const isLoadingDeleted = mutationDelete.isPending

    const fetchAllUser = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        return res
    }
    const fetchGetDetailsUser = async (rowSelected) => {
        setIsLoadingDetails(true)

        const res = await UserService.getDetailsUser(rowSelected, user?.access_token)
        if (res?.data) {
            setStateDetailsUser({
                name: res.data.name,
                phone: res.data.phone,
                email: res.data.email,
                password: res.data.password,
                avatar: res.data.avatar,
                address: res.data.address,
                isAdmin: res.data.isAdmin
            })
        }
        setIsLoadingDetails(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected])

    const queryUser = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUser,
        retry: 3,
        retryDelay: 1000,
    })
    const { isLoading: isLoadingUsers, data: users } = queryUser

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <div className="admin-table-name">{text}</div>,
            width: 100,
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
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

    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'true' : 'false' }
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
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeDetails = (e) => {
        setStateDetailsUser({
            ...stateDetailsUser,
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

        setStateUser({
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: ''
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

    const signUpUser = () => {
        mutation.mutate(stateUser, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    const updateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateDetailsUser, access_token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const deleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, access_token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnChangeImage = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await getBase64(file)
            setStateUser({
                ...stateUser,
                avatar: preview
            })
        }
    }
    const handleOnChangeImageDetails = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await getBase64(file)
            setStateDetailsUser({
                ...stateDetailsUser,
                avatar: preview
            })
        }
    }
    const beforeUpload = (file) => {
        return false
    }

    const isUserFormValid = stateUser.name !== '' && stateUser.phone !== '' && stateUser.email !== '' && stateUser.password !== '' && stateUser.confirmPassword !== ''
    const isDetailsUserFormValid = stateDetailsUser.name !== '' && stateDetailsUser.image !== '' && stateDetailsUser.type !== '' && stateDetailsUser.price !== '' && stateDetailsUser.countInStock !== '';

    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>User management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-user-add-user">
                    <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalAdd">
                        Add user
                    </button>

                    <div className="modal fade" id="modalAdd" tabIndex="-1" aria-labelledby="modalAdd" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalAdd">Add user</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="body">
                                        <div className="row">
                                            <div className="form-floating mb-3 col-12">
                                                <input type="name" className="form-control" id="name" placeholder="name" value={stateUser.name} name="name" onChange={handleOnchange} required />
                                                <label htmlFor="name">Name</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="tel" className="form-control" id="phone" placeholder="0123123123" value={stateUser.phone} name="phone" onChange={handleOnchange} required />
                                                <label htmlFor="phone">Phone</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="email" className="form-control" id="email" placeholder="email@gmail.com" value={stateUser.email} name="email" onChange={handleOnchange} required />
                                                <label htmlFor="email">Email address</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="password" className="form-control" id="password" placeholder="password" value={stateUser.password} name="password" onChange={handleOnchange} required />
                                                <label htmlFor="password">Password</label>
                                            </div>
                                            <div className="form-floating mb-3 col-6">
                                                <input type="password" className="form-control" id="confirmPassword" placeholder="confirmPassword" value={stateUser.confirmPassword} name="confirmPassword" onChange={handleOnchange} required />
                                                <label htmlFor="confirmPassword">Confirm password</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                    <Loading isLoading={isLoading}>
                                        <button type="button" className="btn btn-primary" onClick={signUpUser} disabled={!isUserFormValid}>Add</button>
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="modalEdit" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalEdit">Edit user</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <Loading isLoading={isLoadingDetails}>
                                    <div className="modal-body">
                                        <div className="body">
                                            <div className="row">
                                                <div className="form-floating mb-3 col-12">
                                                    <Upload beforeUpload={beforeUpload} onChange={handleOnChangeImageDetails} showUploadList={false} maxCount={1}>
                                                        <Button icon={<UploadOutlined />}>Avatar</Button>
                                                    </Upload>
                                                    {stateDetailsUser?.avatar && (
                                                        <img src={stateDetailsUser?.avatar} alt="Product" />
                                                    )}
                                                </div>
                                                <div className="form-floating mb-3 col-12">
                                                    <input type="name" className="form-control" id="nameDetail" placeholder="name" value={stateDetailsUser.name} name="name" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="name">Name</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="tel" className="form-control" id="phoneDetail" placeholder="0123123123" value={stateDetailsUser.phone} name="phone" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="phone">Phone</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="email" className="form-control" id="emailDetail" placeholder="email@gmail.com" value={stateDetailsUser.email} name="email" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="email">Email address</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="address" className="form-control" id="addressDetail" placeholder="address" value={stateDetailsUser.address || ''} name="address" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="address">Address</label>
                                                </div>
                                                <div className="form-floating mb-3 col-6">
                                                    <input type="isAdmin" className="form-control" id="isAdminDetail" placeholder="isAdmin" value={stateDetailsUser.isAdmin} name="isAdmin" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="isAdmin">Admin</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                        <Loading isLoading={isLoadingUpdated}>
                                            <button type="button" className="btn btn-primary" onClick={updateUser} disabled={!isDetailsUserFormValid}>Update</button>
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
                                    <h1 className="modal-title fs-5" id="modalDelete">Delete user</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="body">
                                        <div>Are you sure you want to delete this user?</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                    <Loading isLoading={isLoadingDeleted}>
                                        <button type="button" className="btn btn-danger" onClick={deleteUser}>Delete</button>
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TableComponent
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingUsers}
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
