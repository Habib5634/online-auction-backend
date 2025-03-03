const express = require('express')
const sellerMiddleware = require('../middlewares/sellerMiddleware')
const { addProductController, getAllPostedProductsController, getProductBidsController, changeBidStatusController, closeBidsOnProductCloseController, updateProductController } = require('../controllers/productController')
const { getAllTransactions, updateTransactionStatus } = require('../controllers/transactionController')

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



router.put('/product/:productId',sellerMiddleware,updateProductController)


// transactions routes

router.get('/transactions',sellerMiddleware,getAllTransactions)
router.put('/transaction/:transactionId',sellerMiddleware,updateTransactionStatus)

module.exports = router
// PORT = 8080
// SOCKET_PORT = 5000
// MONGO_URL = mongodb+srv://hero5276311:txaVe5GxGFC66FTy@cluster0.w85hcbq.mongodb.net/online-auction
// JWT_SECRET = kjfgnkajhgkhibvcaefniuefi
// # mongodb+srv://hero5276311:<db_password>@cluster0.w85hcbq.mongodb.net/