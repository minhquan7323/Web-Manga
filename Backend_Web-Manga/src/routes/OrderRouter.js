const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')
const { authUserMiddleware } = require('../middleware/authMiddleware')

router.post('/create', authUserMiddleware, orderController.createOrder)

module.exports = router