const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')
const { authUserMiddleware } = require('../middleware/authMiddleware')

router.post('/create', productController.createProduct)
router.put('/update/:id', authUserMiddleware, productController.updateProduct)
router.get('/details/:id', productController.detailsProduct)
router.delete('/delete/:id', productController.deleteProduct)
router.get('/getall', productController.allProduct)

module.exports = router