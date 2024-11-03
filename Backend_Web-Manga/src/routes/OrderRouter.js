const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware')

router.post('/create', authUserMiddleware, orderController.createOrder)
router.get('/getall/:id', authUserMiddleware, orderController.getAllDetailsOrder)
router.get('/details/:id', authUserMiddleware, orderController.getDetailsOrder)
router.delete('/cancel/:id', authUserMiddleware, orderController.cancelOrder)
router.get('/getall', authMiddleware, orderController.getAllOrder)

module.exports = router