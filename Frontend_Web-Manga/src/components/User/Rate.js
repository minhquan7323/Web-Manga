import React from 'react';
import { Rate } from 'antd';
const RateComponent = ({ star, size = 14 }) =>
    <Rate disabled allowHalf defaultValue={star} style={{ fontSize: size }} />
export default RateComponent;