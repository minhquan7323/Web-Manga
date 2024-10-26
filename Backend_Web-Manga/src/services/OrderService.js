const Order = require('../models/OrderProduct')


const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {

        const { orderItems, fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, user } = newOrder
        try {
            const createOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user
            })

            if (createOrder) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createOrder
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
}