const express = require('express')
const sellerMiddleware = require('../middlewares/sellerMiddleware')
const { addProductController, getAllPostedProductsController, getProductBidsController, changeBidStatusController, closeBidsOnProductCloseController, updateProductController } = require('../controllers/productController')
const { getAllTransactions, getSellerTransactions, updateTransactionStatus } = require('../controllers/transactionController')

const router = express.Router()

// ADD JOB || POST
router.post('/add-product/',sellerMiddleware,  addProductController)
// get All JOBs || POST
router.get('/posted-products/',sellerMiddleware,  getAllPostedProductsController)

// get bid on posted product
router.get('/get-product-bids',sellerMiddleware,getProductBidsController)


// update bid status
router.put('/bid/status',sellerMiddleware,changeBidStatusController)

// close auction by seller
router.put('/close-product-bids/:productId',sellerMiddleware,closeBidsOnProductCloseController)


// add job application questions
router.put('/product/:productId',sellerMiddleware,updateProductController)


// transactions routes

// get seller transactions
router.get('/seller-transaction',sellerMiddleware,getSellerTransactions)

// add job application questions
router.put('/update-transaction-status/:transactionId',sellerMiddleware,updateTransactionStatus)

// close  job 
// router.put('/job/:jobId/close',recruiterMiddleware,closeJobController)

// close  job 
// router.put('/job/update',recruiterMiddleware,updateJobFieldsController)

module.exports = router
