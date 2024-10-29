import { Steps } from 'antd'
import React from 'react'
const { Step } = Steps
const Stepc = ({ current = 0 }) => {
    const itemsDelivery = [
        {
            title: 'Places order',
        },
        {
            title: 'Order processing',
        },
        {
            title: 'Payment',
        },
        {
            title: 'Shipping',
        }
    ]
    return (
        <Steps current={current}>
            {itemsDelivery.map((item) => (
                <Step key={item.title} title={item.title} description={item.description} />
            ))}
        </Steps>
    )
}
export default Stepc