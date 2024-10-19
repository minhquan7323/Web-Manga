const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleware, productController.updateProduct)
router.get('/details/:id', productController.detailsProduct)
router.delete('/delete/:id', authMiddleware, productController.deleteProduct)
router.get('/getall', productController.allProduct)

module.exports = router