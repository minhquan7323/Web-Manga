const Mongoose = require('mongoose')
const categorySchema = new Mongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
)
const Category = Mongoose.model("Category", categorySchema)
module.exports = Category
