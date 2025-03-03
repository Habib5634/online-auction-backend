const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { addCategoryController, getAllProductsController, updateProductController, deleteProductController, deleteCategoryController, changeCategoryStatusController, getAllProductCategoriesController } = require('../controllers/productController')
const { getAllUsersController, deleteUserController } = require('../controllers/authController')
const router = express.Router()

// product CATEGORY || POST
router.post('/category/',adminMiddleware, addCategoryController)
router.delete('/category/:categoryId',adminMiddleware, deleteCategoryController)
router.put('/category/:categoryId',adminMiddleware, changeCategoryStatusController)


// // ALL PRODUCT CATEGORIES || GET
router.get('/categories',adminMiddleware,getAllProductCategoriesController)
// get all products
router.get('/products/',adminMiddleware, getAllProductsController)
router.put('/product/:productId',adminMiddleware,updateProductController)
router.delete('/product/:productId',adminMiddleware,deleteProductController)

// users
router.get('/users/',adminMiddleware, getAllUsersController)
router.delete('/user/:userId',adminMiddleware, deleteUserController)
router.delete('/user/:userId',adminMiddleware, deleteUserController)




module.exports = router


