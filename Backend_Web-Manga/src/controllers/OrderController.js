const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body

        if (!fullName || !address || !phone || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is require'
            })
        }

        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
}