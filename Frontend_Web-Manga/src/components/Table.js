import { Table } from "antd";
import React from "react";
import Loading from '../components/Loading/Loading'

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], isLoading = false, columns = [] } = props

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
        <Loading isLoading={isLoading}>
            <Table
                bordered
                rowSelection={{
                    type: selectionType,
                    ...rowSelection
                }}
                columns={columns}
                dataSource={data}
                scroll={{
                    x: 'max-content',
                }}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent