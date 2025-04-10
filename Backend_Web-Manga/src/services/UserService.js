const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')
const EmailService = require('./EmailService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            const hashPassword = bcrypt.hashSync(password, 10)
            const createUser = await User.create({
                name,
                email,
                password: hashPassword,
                phone
            })
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createUser
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'Update user success',
                data: updateUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                });
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete user success'
            });
        } catch (e) {
            reject(e);
        }
    });
}

const deleteManyUsers = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids });

            resolve({
                status: 'OK',
                message: 'Delete users success'
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });

            if (user === null) {
                return resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: user
            });
        } catch (e) {
            reject(e);
        }
    });
}

// const forgetPasswordUser = (email) => {
//     return new Promise(async (resolve, reject) => {
//         const otpRand = Math.floor(100000 + Math.random() * 900000)
//         try {
//             const checkUser = await User.findOne({ email: email })
//             if (!checkUser) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Email does not exist'
//                 })
//             } else {
//                 await EmailService.sendEmailForgetPassword(email, otpRand)
//                 resolve({
//                     status: 'OK',
//                     message: 'SUCCESS'
//                 })
//             }
//         } catch (e) {
//             reject({
//                 status: 'ERR',
//                 message: e.message || 'An unexpected error occurred'
//             })
//         }
//     })
// }
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUsers,
    // forgetPasswordUser
}