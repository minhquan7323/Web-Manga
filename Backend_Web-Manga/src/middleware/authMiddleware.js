const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        }
        else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }

    })
}

const authMiddleware = (req, res, next) => {
    const tokenHeader = req.headers.token;
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token hợp lệ là bắt buộc (Định dạng: Bearer <token>)',
            status: 'ERROR'
        })
    }

    const token = tokenHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Token đã hết hạn hoặc không hợp lệ',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(403).json({
                message: 'Bạn không có quyền Admin để thực hiện hành động này',
                status: 'ERROR'
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}