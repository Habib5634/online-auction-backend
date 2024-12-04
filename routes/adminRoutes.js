const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { addCategoryController } = require('../controllers/productController')
const router = express.Router()

// JOB CATEGORY || POST
router.post('/category/',adminMiddleware, addCategoryController)

// update  job 
// router.put('/job/update',adminMiddleware,updateJobFieldsController)

// get all  jobs 
// router.get('/jobs',adminMiddleware,getAllJobsController)

// get All users 
// router.get('/users',adminMiddleware,getAllUsersController)

// delete user by id
// router.delete('/user/:userId',adminMiddleware,deleteUserByIdController)




module.exports = router


