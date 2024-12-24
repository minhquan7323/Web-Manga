const Mongoose = require('mongoose')

const orderSchema = new Mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, require: true },
                amount: { type: Number, require: true },
                image: { type: String, require: true },
                price: { type: Number, require: true },
                discount: { type: Number },
                product: {
                    type: Mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    require: true,
                },
            }
        ],
        shippingAddress: {
            fullName: { type: String, require: true },
            address: { type: String, require: true },
            // city: { type: String, require: true },
            phone: { type: Number, require: true },
        },
        paymentMethod: { type: String, require: true },
        itemsPrice: { type: Number, require: true },
        shippingPrice: { type: Number, require: true },
        totalPrice: { type: Number, require: true },
        user: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
        isPaid: { type: Boolean, require: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, require: false },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true
    }
)
const Order = Mongoose.model("Order", orderSchema)
module.exports = Order
