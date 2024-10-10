import { Spin } from "antd";
import '../../../node_modules/antd/dist/antd.css';
import React from "react";
const Loading = ({ children, isLoading = false, delay = 200 }) => {
    return (
        <Spin spinning={isLoading} delay={delay}>
            {children}
        </Spin>
    )
}

export default Loading;