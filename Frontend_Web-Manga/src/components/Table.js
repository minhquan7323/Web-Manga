import { Table } from "antd";
import React, { useState } from "react";
import Loading from '../components/Loading/Loading'

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], deleteMany, multiChoice = false } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     name: record.name
        // })
    }
    const handleDeleteAll = async () => {
        await deleteMany(rowSelectedKeys)
        setRowSelectedKeys([])
    }

    return (
        <Loading isLoading={isLoading}>
            {multiChoice && rowSelectedKeys.length > 0 && (
                <button className="btn btn-primary" style={{ marginBottom: '10px' }} onClick={handleDeleteAll}>Delete all?</button>
            )}
            <Table
                bordered
                rowSelection={multiChoice && {
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