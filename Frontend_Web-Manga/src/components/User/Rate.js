import React from 'react';
import { Rate } from 'antd';
const RateComponent = ({ star }) =>
    <Rate disabled allowHalf defaultValue={star} />
export default RateComponent;