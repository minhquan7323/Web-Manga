import { Table } from "antd";
import React from "react";

const TableComponent = (props) => {
    const { selectionType = 'checkbox' } = props

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            // render: (text) => <a>{text}</a>
        },
        {
            title: 'age',
            dataIndex: 'age',
        },
        {
            title: 'address',
            dataIndex: 'address',
        }
    ]
    const data = [
        {
            key: '1',
            name: 'test 1',
            age: 12,
            address: 'hcm'
        },
        {
            key: '2',
            name: 'test 2',
            age: 12,
            address: 'hcm'
        },
        {
            key: '3',
            name: 'test 3',
            age: 12,
            address: 'hcm'
        },
    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys:${selectedRowKeys}`, `selectedRows:${selectedRows}`);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name
        })
    }

    return (
        <Table
            rowSelection={{
                type: selectionType,
                ...rowSelection
            }}
            columns={columns}
            dataSource={data}
        />
    )
}

export default TableComponent