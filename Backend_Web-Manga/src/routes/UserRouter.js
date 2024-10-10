const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')

router.post('/signup', userController.createUser)
router.post('/signin', userController.loginUser)
router.post('/signout', userController.logoutUser)
router.put('/updateuser/:id', userController.updateUser)
router.delete('/deleteuser/:id', authMiddleware, userController.deleteUser)
router.get('/getalluser', authMiddleware, userController.getAllUser)
router.get('/getdetailsuser/:id', authUserMiddleware, userController.getDetailsUser)
router.post('/refreshtoken', userController.refreshTokenJwtService)

module.exports = router