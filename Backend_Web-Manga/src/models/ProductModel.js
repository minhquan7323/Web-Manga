const Mongoose = require('mongoose')
const productSchema = new Mongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        image: { type: String, require: true },
        type: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Category', require: true }],
        price: { type: Number, require: true, min: 0 },
        stock: { type: Number, require: true, min: 0 },
        rating: { type: Number, min: 0, max: 5 },
        description: { type: String, default: '' },
        supplier: { type: String, default: '' },
        publisher: { type: String, default: '', require: true },
        author: { type: String, default: '', require: true },
        cover: { type: String, require: true },
        sold: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
)
const Product = Mongoose.model("Product", productSchema)
module.exports = Product
