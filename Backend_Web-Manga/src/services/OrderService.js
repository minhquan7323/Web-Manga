const Order = require('../models/OrderProduct')
const Product = require('../models/ProductModel')

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, user } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findByIdAndUpdate(
                    {
                        _id: order.product,
                        stock: {
                            $gte: order.amount
                        }
                    },
                    {
                        $inc: {
                            stock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    {
                        new: true
                    }
                )
                if (productData) {
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
                        return {
                            status: 'OK',
                            message: 'SUCCESS'
                        }
                    } else {
                        return {
                            status: 'OK',
                            message: 'ERR',
                            id: order.product
                        }
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `Product id:${newData.join(',')} out of stock`
                })
            }
            resolve({
                status: 'OK',
                message: `success`
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getAllDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({ user: id })

            if (order === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({ _id: id })

            if (order === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrder = async (id, data) => {
    try {
        if (!data || data.length === 0) {
            return {
                status: 'ERR',
                message: 'No order items provided'
            }
        }
        const orderResults = await Promise.all(data.map(async (order) => {
            const productData = await Product.findByIdAndUpdate(
                {
                    _id: order.product,
                    selled: {
                        $gte: order.amount
                    }
                },
                {
                    $inc: {
                        stock: order.amount,
                        selled: -order.amount
                    }
                },
                {
                    new: true
                }
            )
            if (!productData) {
                return order.product
            }
            return null
        }))
        const errors = orderResults.filter(result => result)
        if (errors.length) {
            return {
                status: 'ERR',
                message: `Product id(s): ${errors.join(', ')} does not exist`
            }
        }
        const orderDeleted = await Order.findByIdAndDelete(id)
        if (!orderDeleted) {
            return {
                status: 'ERR',
                message: 'The order is not defined'
            }
        }
        return {
            status: 'OK',
            message: 'Success',
            data: orderDeleted
        }

    } catch (e) {
        return {
            status: 'ERR',
            message: 'Internal Server Error'
        }
    }
}


module.exports = {
    createOrder,
    getAllDetailsOrder,
    getDetailsOrder,
    cancelOrder
}