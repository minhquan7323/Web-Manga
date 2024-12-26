const Mongoose = require('mongoose')
const supplierSchema = new Mongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
)
const Supplier = Mongoose.model("Supplier", supplierSchema)
module.exports = Supplier
