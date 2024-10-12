const moongoose = require('mongoose')
const userSchema = new moongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        address: { type: String },
        isAdmin: { type: Boolean, default: false, require: true },
        phone: { type: Number },
        access_token: { type: String, require: true },
        refresh_token: { type: String, require: true },
    },
    {
        timestamps: true
    }
)
const User = moongoose.model("User", userSchema)
module.exports = User
