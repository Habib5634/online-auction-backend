const express = require('express')
const { getLatestProductsController, getProductByIdController, getProductsByCategoryController, getAllProductCategoriesController, addBidController, getPostedBidsController, endAllAuctionsController, getCategoryByIdController, getAllNotifications, getSingleNotification, markAsRead, markAllAsRead } = require('../controllers/productController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

// PRODUCT BY ID || GET
router.get('/get-single-product/:id',getProductByIdController)

// GET LATEST PRODUCTS || GET
router.get('/get-latest-products/',getLatestProductsController)


// PRODUCT BY CATEGORY || GET
router.get('/products/category/:categoryId',getProductsByCategoryController)


// // ALL PRODUCT CATEGORIES || GET
router.get('/categories',getAllProductCategoriesController)

// // Apply for PRODUCT
router.post('/product/add-bid',authMiddleware,addBidController)


// // get All Posted Bids
router.get('/product/get-user-bids',authMiddleware,getPostedBidsController)


// close auctions which time is ended 
router.post('/end-all-auctions',endAllAuctionsController)

// // get PRODUCT application questions
router.get('/category/:id/',getCategoryByIdController)

// get al notifications
router.get('/notifications',authMiddleware,getAllNotifications)

// get single notifiction detail
router.get('/notifications/:notificationId', authMiddleware, getSingleNotification);

// mark as read single notification
router.put('/notifications/mark-as-read/:notificationId', authMiddleware, markAsRead);

// mark al as read notification
router.put('/notifications/mark-all-as-read', authMiddleware, markAllAsRead);

// // submit application questions answers
// router.post('/assessment/mark-ineligible',authMiddleware,markUserIneligibleController)






module.exports = router


