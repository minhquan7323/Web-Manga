import { Table } from "antd"
import React, { useState } from "react"
import Loading from '../components/Loading/Loading'

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], deleteMany, multiChoice = false } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
    }

    const handleDeleteAll = async () => {
        await deleteMany(rowSelectedKeys)
        setRowSelectedKeys([])
    }

    const handleTableChange = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
                pagination={{
                    position: ['bottomCenter'],
                }}
                scroll={{
                    x: 'max-content',
                }}
                onChange={handleTableChange}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent