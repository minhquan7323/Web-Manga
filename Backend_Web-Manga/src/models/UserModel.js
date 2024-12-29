const Mongoose = require('mongoose')
const userSchema = new Mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        avatar: { type: String },
        address: { type: String },
        isAdmin: { type: Boolean, default: false, require: true },
        isActive: { type: Boolean, default: true, require: true },
        phone: { type: Number },
        access_token: { type: String, require: true },
        refresh_token: { type: String, require: true },
    },
    {
        timestamps: true
    }
)
const User = Mongoose.model("User", userSchema)
module.exports = User
