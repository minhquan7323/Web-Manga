const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.post('/signup', userController.createUser)
router.post('/signin', userController.loginUser)
router.put('/updateuser/:id', userController.updateUser)
router.delete('/deleteuser/:id', authMiddleware, userController.deleteUser)

module.exports = router