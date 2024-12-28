const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { addCategoryController } = require('../controllers/productController')
const { updateTransactionStatus, getAllTransactions, deleteTransaction } = require('../controllers/transactionController')
const router = express.Router()

// JOB CATEGORY || POST
router.post('/category/',adminMiddleware, addCategoryController)


// update transactions status
router.put('/update-transaction-status/:transactionId',adminMiddleware,updateTransactionStatus)

// get all transactions
router.get('/transactions',adminMiddleware,getAllTransactions)


// get all transactions
router.delete('/delete-transaction/:id',adminMiddleware,deleteTransaction)


// update  job 
// router.put('/job/update',adminMiddleware,updateJobFieldsController)

// get all  jobs 
// router.get('/jobs',adminMiddleware,getAllJobsController)

// get All users 
// router.get('/users',adminMiddleware,getAllUsersController)

// delete user by id
// router.delete('/user/:userId',adminMiddleware,deleteUserByIdController)




module.exports = router


