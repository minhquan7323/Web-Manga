const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/CategoryController')
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, categoryController.createCategory)
router.put('/update/:id', authMiddleware, categoryController.updateCategory)
router.get('/getall', categoryController.getAllCategory)
router.get('/details/:id', categoryController.getDetailsCategory)

module.exports = router