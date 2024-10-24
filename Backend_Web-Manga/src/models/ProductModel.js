const moongoose = require('mongoose')
const productSchema = new moongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        image: { type: String, require: true },
        type: { type: [String], require: true },
        price: { type: Number, require: true },
        stock: { type: Number, require: true },
        rating: { type: Number },
        description: { type: String },
        supplier: { type: String },
        publisher: { type: String },
        author: { type: String },
        cover: { type: String }
    },
    {
        timestamps: true
    }
)
const Product = moongoose.model("Product", productSchema)
module.exports = Product
