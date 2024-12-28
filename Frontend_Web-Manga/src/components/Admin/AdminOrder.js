import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import * as OrderService from '../../services/OrderService'
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { convertPrice, sortByDate } from '../../utils.js'
import * as message from "../Message/Message.js"
import { Modal as BootstrapModal } from 'bootstrap'
import Loading from '../Loading/Loading.js'
import { orderContant } from '../../contant.js'
import { useMutationHooks } from '../../hooks/useMutationHook.js'

function AdminOrder() {
    const user = useSelector((state) => state?.user)
    const [rowSelected, setRowSelected] = useState('')
    const [stateOrder, setStateOrder] = useState({
        isDelivered: ''
    })
    const [stateDetailsOrder, setStateDetailsOrder] = useState({
        isDelivered: ''
    })
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const fetchGetDetailsOrder = async (rowSelected) => {
        setIsLoadingDetails(true)
        const res = await OrderService.getDetailsOrder(rowSelected)
        if (res?.data) {
            setStateDetailsOrder({
                isDelivered: res.data.isDelivered
            })
        }
        setIsLoadingDetails(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsOrder(rowSelected)
        }
    }, [rowSelected])

    const fetchAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }

    const queryOrder = useQuery({
        queryKey: ['order'],
        queryFn: fetchAllOrder,
        retry: 3,
        retryDelay: 1000,
    })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await OrderService.updateOrder(id, rests, access_token)
            return res
        }
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const isLoadingUpdated = mutationUpdate.isPending

    const handleModalOpen = (modalType) => {
        const modalElement = document.getElementById(modalType)
        if (modalType === 'modalEdit' && modalElement) {
            const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
            if (modalInstance)
                modalInstance.show()
        }
    }
    const handleCancel = () => {
        const modalIds = ['modalEdit']

        modalIds.forEach(modalId => {
            const modalElement = document.getElementById(modalId)
            if (modalElement) {
                const modalInstance = BootstrapModal.getOrCreateInstance(modalElement)
                if (modalInstance) {
                    modalInstance.hide()
                }
            }
        })

        setStateOrder({
            isDelivered: ''
        });
    }
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [dataUpdated, isSuccessUpdated, isErrorUpdated])
    const updateCategory = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            ...stateDetailsOrder,
            access_token: user?.access_token
        }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })
    }

    const handleOnchangeDetails = (isDelivered) => {
        setStateDetailsOrder((prev) => ({
            ...prev,
            isDelivered: isDelivered
        }))
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <div className="admin-table-name">{text}</div>,
            width: 150,
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            render: (text) => <span> {convertPrice(text)}</span>,
        },
        {
            title: 'Paid',
            dataIndex: 'isPaid',
            render: (text) => <span> {text ? 'Paid' : 'Unpaid'}</span>,
        },
        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            render: (text) => <span> {text ? 'Delivered' : 'On delivery'}</span>,
            width: 120,
        },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            render: (text) => <span> {orderContant.payment[text]}</span>,
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

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {
            ...order, key: order._id, name: order.shippingAddress.fullName,
            address: order.shippingAddress.address, phone: order.shippingAddress.phone
        }
    })

    return (
        <>
            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Order management</div>
                </div>
            </div>

            <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="modalEdit" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modalEdit">Edit shipped</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
                        </div>
                        <Loading isLoading={isLoadingDetails}>
                            <div className="modal-body">
                                <div className="body">
                                    <div className="row">
                                        <select
                                            id="delivery"
                                            className="form-select"
                                            value={stateDetailsOrder.isDelivered}
                                            onChange={(e) => handleOnchangeDetails(e.target.value === "true")}
                                        >
                                            <option value="false">On delivery</option>
                                            <option value="true">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Close</button>
                                <Loading isLoading={isLoadingUpdated}>
                                    <button type="button" className="btn btn-primary" onClick={updateCategory}>Update</button>
                                </Loading>
                            </div>
                        </Loading>
                    </div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <TableComponent
                    columns={columns}
                    data={sortByDate(dataTable)}
                    isLoading={isLoadingOrders}
                />
            </div>
        </>
    )
}

export default AdminOrder
