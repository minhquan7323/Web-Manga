const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.'']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is require'
            })
        }
        else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email is incorrect'
            })
        }
        else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Confirm password is incorrect'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.'']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is require'
            })
        }
        else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email is incorrect'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/'//////
        })
        return res.status(200).json({ ...newResponse, refresh_token })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyUsers = async (req, res) => {
    try {
        const ids = req.body.ids

        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUsers(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshTokenJwtController = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// const forgetPasswordUser = async (req, res) => {
//     try {
//         const { email } = req.body
//         const reg = /^\w+([-+.'']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//         const isCheckEmail = reg.test(email)

//         if (!email) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is require'
//             })
//         }
//         else if (!isCheckEmail) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'Email is incorrect'
//             })
//         }
//         const response = await UserService.forgetPasswordUser(req.body)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshTokenJwtController,
    deleteManyUsers,
    // forgetPasswordUser
}