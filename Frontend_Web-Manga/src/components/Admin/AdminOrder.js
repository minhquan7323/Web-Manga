import React, { useState, useEffect } from "react"
import TableComponent from "../Table"
import * as OrderService from '../../services/OrderService.js'
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { convertPrice, sortByDate } from '../../utils.js'
import { orderContant } from '../../contant.js'
function AdminOrder() {
    const user = useSelector((state) => state?.user)

    const fetchAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchAllOrder,
        retry: 3,
        retryDelay: 1000,
    })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

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
        },
        // {
        //     title: 'Shipped',
        //     dataIndex: 'isDeliveried',
        //     render: (text) => <span> {convertPrice(text)}</span>,
        // },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            render: (text) => <span> {orderContant.payment[text]}</span>,
        }
    ]

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        console.log('order', order);
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
