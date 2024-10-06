const moongoose = require('mongoose')
const userSchema = new moongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        isAdmin: { type: Boolean, default: false },
        phone: { type: Number, require: true },
        access_token: { type: String },
        refresh_token: { type: String },
    },
    {
        timestamps: true
    }
)
const User = moongoose.model("User", userSchema)
module.exports = User
