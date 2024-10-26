const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, productController.createProduct)
router.put('/update/:id', authMiddleware, productController.updateProduct)
router.get('/details/:id', productController.detailsProduct)
router.delete('/delete/:id', authMiddleware, productController.deleteProduct)
router.get('/getall', productController.allProduct)
router.post('/deletemany', authMiddleware, productController.deleteManyProducts)
router.get('/getalltypeproduct', productController.getAllTypeProduct)

module.exports = router