import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import { sortByDate } from '../../utils'
import * as CategoryService from '../../services/CategoryService.js'
import * as message from "../Message/Message.js"
import { useMutationHooks } from '../../hooks/useMutationHook.js'
import Loading from '../Loading/Loading.js'
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useQuery } from "@tanstack/react-query"
import { Modal as BootstrapModal } from 'bootstrap'
import { useSelector } from "react-redux"

function AdminCategory() {
    const [stateCategory, setStateCategory] = useState({
        name: '',
        isActive: ''
    })
    const [stateDetailsCategory, setStateDetailsCategory] = useState({
        name: '',
        isActive: ''
    })
    const [rowSelected, setRowSelected] = useState('')
    const user = useSelector((state) => state?.user)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const mutation = useMutationHooks(
        async (data) => {
            const { access_token, ...rests } = data
            const res = await CategoryService.createCategory(rests, access_token)
            return res
        }
    )
    const { data, isSuccess, isError } = mutation
    const isLoading = mutation.isPending

    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await CategoryService.updateCategory(id, rests, access_token)
            return res
        }
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const isLoadingUpdated = mutationUpdate.isPending

    const fetchAllCategory = async () => {
        const res = await CategoryService.getAllCategory(user?.access_token)
        return res
    }

    const fetchGetDetailsCategory = async (rowSelected) => {
        setIsLoadingDetails(true)

        const res = await CategoryService.getDetailsCategory(rowSelected, user?.access_token)
        if (res?.data) {
            setStateDetailsCategory({
                name: res.data.name,
                isActive: res.data.isActive
            })
        }
        setIsLoadingDetails(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsCategory(rowSelected)
        }
    }, [rowSelected])

    const queryCategory = useQuery({
        queryKey: ['categories'],
        queryFn: fetchAllCategory,
        retry: 3,
        retryDelay: 1000,
    })
    const { isLoading: isLoadingCategories, data: categories } = queryCategory

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <div className="admin-table-name">{text}</div>,
            width: 300,
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            filters: [
                {
                    text: 'Active',
                    value: 'Active',
                },
                {
                    text: 'Hidden',
                    value: 'Hidden',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.isActive.indexOf(value) === 0
        },
        {
            title: 'action',
            dataIndex: 'action',
            fixed: 'right',
            width: 50,
            render: (_, record) => (
                <div className="admin-table-action">
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
    const dataTable = categories?.data?.length && categories?.data?.map((category) => {
        return { ...category, key: category._id, isActive: category.isActive ? 'Active' : 'Hidden' }
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

    const handleOnchange = (e) => {
        setStateCategory({
            ...stateCategory,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeDetails = (e) => {
        const { name, type, value, checked } = e.target
        setStateDetailsCategory({
            ...stateDetailsCategory,
            [name]: type === "checkbox" ? checked : value
        })
    }


    const handleCancel = () => {
        const modalIds = ['modalAdd', 'modalEdit']

        modalIds.forEach(modalId => {
            const modalElement = document.getElementById(modalId)
            if (modalElement) {
                const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
                if (modalInstance) {
                    modalInstance.hide()
                }
            }
        })

        setStateCategory({
            name: '',
            isActive: ''
        });
    }

    const createCategory = () => {

        mutation.mutate({
            ...stateCategory,
            access_token: user?.access_token
        }, {
            onSettled: () => {
                queryCategory.refetch()
            }
        })
    }
    const updateCategory = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            ...stateDetailsCategory,
            access_token: user?.access_token
        }, {
            onSettled: () => {
                queryCategory.refetch()
            }
        })
    }

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
    }

    const isCategoryFormValid = stateCategory.name !== ''
    const isDetailsCategoryFormValid = stateDetailsCategory.name !== ''
    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Category management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-user-add-user">
                    <button type="button" onClick={() => handleModalOpen('modalAdd')} className="btn btn-outline-success">
                        Add category
                    </button>

                    <div className="modal fade" id="modalAdd" tabIndex="-1" aria-labelledby="modalAdd" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalAdd">Add category</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="body">
                                        <div className="row">
                                            <div className="form-floating mb-3 col-12">
                                                <input type="name" className="form-control" id="name" placeholder="name" value={stateCategory.name} name="name" onChange={handleOnchange} required />
                                                <label htmlFor="name">Name</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                    <Loading isLoading={isLoading}>
                                        <button type="button" className="btn btn-primary" onClick={createCategory} disabled={!isCategoryFormValid}>Add</button>
                                    </Loading>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="modalEdit" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalEdit">Edit category</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                                </div>
                                <Loading isLoading={isLoadingDetails}>
                                    <div className="modal-body">
                                        <div className="body">
                                            <div className="row">
                                                <div className="form-floating mb-3 col-8">
                                                    <input type="name" className="form-control" id="nameDetail" placeholder="name" value={stateDetailsCategory.name} name="name" onChange={handleOnchangeDetails} required />
                                                    <label htmlFor="name">Name</label>
                                                </div>
                                                <div className="form-check form-switch col-4" style={{ paddingTop: '20px' }}>
                                                    <input className="form-check-input" onChange={handleOnchangeDetails} checked={stateDetailsCategory.isActive} type="checkbox" role="switch" id="isActiveDetail" name="isActive" />
                                                    <label className="form-check-label" htmlFor="isActive">Active</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                        <Loading isLoading={isLoadingUpdated}>
                                            <button type="button" className="btn btn-primary" onClick={updateCategory} disabled={!isDetailsCategoryFormValid}>Update</button>
                                        </Loading>
                                    </div>
                                </Loading>
                            </div>
                        </div>
                    </div>
                </div>

                <TableComponent
                    columns={columns}
                    data={sortByDate(dataTable)}
                    isLoading={isLoadingCategories}
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

export default AdminCategory
