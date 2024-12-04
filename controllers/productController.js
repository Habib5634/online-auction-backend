const categoryModel = require("../models/categoryModel")
const productModel = require("../models/productModel")
const bidModel = require('../models/bidModel')
const Notification = require('../models/notificationModel');
// add product category for admin
const addCategoryController = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).send({
                success: false,
                message: 'please provide required fields'
            })
        }


        // category exist!!!
        const existing = await categoryModel.findOne({ name })
        if (existing) {
            return res.status(500).send({
                success: false,
                message: "Category Already exist"
            })
        }
        // save user
        const category = await categoryModel.create({ name, description, isActive });
        res.status(201).send({
            success: true,
            message: "Successfully Created Category",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in post category API",
            error
        })
    }
}


// add product by seller
const addProductController = async (req, res) => {
    try {
        const { 
            sellerId, 
            productName, 
            productCategory, 
            location, 
            productCompany, 
            productType, 
            images, 
            price, 
            description1, 
            description2, 
            description3, 
            isOpen, 
            startDate, 
            endDate 
        } = req.body;

        // Validation for required fields
        if (!sellerId || !productName || !location || !productCategory || !productType || !price || !startDate || !endDate) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if startDate and endDate are valid
        if (new Date(startDate) < new Date()) {
            return res.status(400).send({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).send({
                success: false,
                message: 'End date must be after the start date'
            });
        }

        // Check if the product already exists
        const existing = await productModel.findOne({
            sellerId,
            productName,
            location,
        });

        if (existing) {
            return res.status(400).send({
                success: false,
                message: "Product already exists",
            });
        }

        // Save product
        const product = await productModel.create({ 
            sellerId, 
            productName, 
            productCategory, 
            location, 
            productCompany, 
            productType, 
            images, 
            price, 
            description1, 
            description2, 
            description3, 
            isOpen, 
            startDate, 
            endDate 
        });

        res.status(201).send({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in add product API",
            error
        });
    }
};

// Gett Latest 10 Auction Products Controller
const getLatestProductsController = async (req, res) => {
    try {
        // Retrieve the latest 10 products where isOpen is true, sorted by creation date (descending order)
        const products = await productModel
            .find({ isOpen: true }) // Filter only products with isOpen: true
            .sort({ createdAt: -1 }) // Sort by creation date (latest first)
            .limit(10) // Limit to 10 results
            .populate('productCategory', 'name description').populate('sellerId', 'fullName ');; // Populate productCategory with specific fields

        res.status(200).send({
            success: true,
            message: "Latest 10 open products retrieved successfully",
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving latest products",
            error,
        });
    }
};

// Get Product By Id
const getProductByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await productModel.findOne({ _id: id, isOpen: true }).populate('productCategory', 'name description').populate('sellerId', 'fullName ');;

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "product retrieved successfully",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving product",
            error,
        });
    }
};
// Get Category By Id
const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const category = await categoryModel.findOne({ _id: id});

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "category not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "category retrieved successfully",
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving product",
            error,
        });
    }
};

// Get Seller Posted Products
const getAllPostedProductsController = async (req, res) => {
    try {
        const sellerId = req.user._id; // Assuming authMiddleware sets req.user

        // Fetch products posted by this seller
        const products = await productModel.find({ sellerId }).populate('productCategory', 'name description');;

        res.status(200).send({
            success: true,
            message: "All products posted by seller retrieved successfully",
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving posted products",
            error,
        });
    }
};

// get all product categories controller
const getAllProductCategoriesController = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await categoryModel.find();

        if (!categories.length) {
            return res.status(404).send({
                success: false,
                message: "No product categories found",
            });
        }

        res.status(200).send({
            success: true,
            message: "product categories retrieved successfully",
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving product categories",
            error,
        });
    }
};


// get products by category
const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find products matching the given category ID
        const products = await productModel.find({ productCategory: categoryId, isOpen: true }).populate('productCategory', 'name description').populate('sellerId', 'fullName ');;

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No products found in this category",
            });
        }

        res.status(200).send({
            success: true,
            message: "products retrieved successfully by category",
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving products by category",
            error,
        });
    }
};


// add bid on product 
const addBidController = async (req, res) => {
    try {
        const { productId, bidPrice } = req.body;
        const bidderId = req.user._id;

        // Validation
        if (!bidderId || !productId) {
            return res.status(400).send({
                success: false,
                message: "Bidder ID and product ID are required",
            });
        }

        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        // Validate bid price
        if (bidPrice <= product.price) {
            return res.status(400).send({
                success: false,
                message: "Bid price must be greater than the product price",
            });
        }

        // Check for existing bid
        const existingBid = await bidModel.findOne({ bidderId, productId });
        if (existingBid) {
            return res.status(400).send({
                success: false,
                message: "You have already added a bid on this product",
            });
        }

        // Create bid
        const bid = await bidModel.create({
            bidderId,
            productId,
            bidPrice,
        });

        // Create notification for the seller
        const notificationMessage = `User ${req.user.userName} has placed a bid of ${bidPrice} on your product "${product.productName}".`;
        await Notification.create({
            senderId: bidderId,
            receiverId: product.sellerId,
            message: notificationMessage,
        });

        res.status(201).send({
            success: true,
            message: "Bid added successfully and notification sent to the seller.",
            bid,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error adding bid on product",
            error,
        });
    }
};



// get all bid posted by user controller
const getPostedBidsController = async (req, res) => {
    try {
        const bidderId = req.user._id;  // Get bidderId from the authenticated user

        // Fetch userBids by the authenticated applicant
        const userBids = await bidModel.find({ bidderId })
        .populate({
            path: 'productId',
            select: 'productName productCompany location images startDate endDate price sellerId', // Select sellerId here
            populate: {
                path: 'sellerId', // Populate sellerId through productModel
                select: 'fullName contact email ', // Choose fields to populate
            },
        }).populate('bidderId', 'fullName email');  // Optionally populate applicant details

        if (!userBids.length) {
            return res.status(404).send({
                success: false,
                message: "No bids found for this user",
            });
        }

        res.status(200).send({
            success: true,
            message: "Bids retrieved successfully",
            userBids,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving bids",
            error,
        });
    }
};


// get bids on seller products
const getProductBidsController = async (req, res) => {
    try {
        const sellerId = req.user._id;  // Get sellerId from the authenticated user

        // Find jobs posted by the recruiter
        const products = await productModel.find({ sellerId });

        if (!products.length) {
            return res.status(404).send({
                success: false,
                message: "No products found for this recruiter",
            });
        }

        // Extract job IDs
        const productIds = products.map((product) => product._id);

        // Find applications for these products
        const bids = await bidModel.find({ productId: { $in: productIds } })
            .populate('productId', 'productName companyName location price')  // Populate job details
            .populate('bidderId', 'fullName email contact ');  // Populate applicant details

        if (!bids.length) {
            return res.status(404).send({
                success: false,
                message: "No bids found for your products",
            });
        }

        res.status(200).send({
            success: true,
            message: "bids retrieved successfully",
            bids,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving bids",
            error,
        });
    }
};


// const changeBidStatusController = async (req, res) => {
//     try {
//         const { bidId, newStatus } = req.body;

//         // Validate the new status
//         const validStatuses = ['running', 'winner', 'closed'];
//         if (!validStatuses.includes(newStatus)) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Invalid status. Valid statuses are 'running', 'winner', or 'closed'.",
//             });
//         }

//         // Find the application
//         const bid = await bidModel.findById(bidId).populate('productId');
//         if (!bid) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Bid not found.",
//             });
//         }

       
//         // Update the job status
//         bid.bidStatus = newStatus;
//         await bid.save();

//         res.status(200).send({
//             success: true,
//             message: "Job status updated successfully.",
//             bid,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({
//             success: false,
//             message: "Error updating job status.",
//             error,
//         });
//     }
// };
// Change bid status controller
const changeBidStatusController = async (req, res) => {
    try {
        const { bidId, newStatus } = req.body;

        // Validate the new status
        const validStatuses = ['running', 'winner', 'closed'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).send({
                success: false,
                message: "Invalid status. Valid statuses are 'running', 'winner', or 'closed'.",
            });
        }

        // Find the bid by ID
        const bid = await bidModel.findById(bidId).populate('productId');
        if (!bid) {
            return res.status(404).send({
                success: false,
                message: "Bid not found.",
            });
        }

        // If new status is 'winner', close all other bids on the same product
        if (newStatus === 'winner') {
            await bidModel.updateMany(
                { productId: bid.productId, _id: { $ne: bidId } }, // Exclude the winning bid
                { bidStatus: 'closed' }
            );
        }

        // Update the bid status
        bid.bidStatus = newStatus;
        await bid.save();

        res.status(200).send({
            success: true,
            message: "Bid status updated successfully.",
            bid,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating bid status.",
            error,
        });
    }
};

// Close all bids if product is set to not open
const closeBidsOnProductCloseController = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found.",
            });
        }

        // Check if product isOpen is being set to false
        if (product.isOpen === false) {
            return res.status(400).send({
                success: false,
                message: "Product is already closed.",
            });
        }

        // Update the product to isOpen: false
        product.isOpen = false;
        await product.save();

        // Close all bids for this product
        await bidModel.updateMany(
            { productId },
            { bidStatus: 'closed' }
        );

        res.status(200).send({
            success: true,
            message: "All bids closed successfully as the product is no longer open.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error closing bids for the product.",
            error,
        });
    }
};

const endAllAuctionsController = async (req, res) => {
    try {
        // Get the current time
        const currentTime = new Date();
console.log(currentTime)
// Find all products where the auction has ended and is still open
const expiredProducts = await productModel.find({
    isOpen: true,
    endDate: { $lte: currentTime },
});

console.log(expiredProducts)
        if (expiredProducts.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No auctions have ended at this time.",
            });
        }

        // Process each expired product
        for (const product of expiredProducts) {
            // Close the product (set isOpen to false)
            product.isOpen = false;
            await product.save();

            // Find all bids for this product
            const bids = await bidModel.find({ productId: product._id });

            if (bids.length > 0) {
                // Find the highest bid
                const highestBid = bids.reduce((max, bid) =>
                    bid.bidPrice > max.bidPrice ? bid : max,
                    bids[0]
                );

                // Mark the highest bid as the winner
                await bidModel.findByIdAndUpdate(highestBid._id, {
                    bidStatus: "winner",
                });

                // Close all other bids
                await bidModel.updateMany(
                    { productId: product._id, _id: { $ne: highestBid._id } },
                    { bidStatus: "closed" }
                );
            }
        }

        res.status(200).send({
            success: true,
            message: "All ended auctions have been processed successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error processing ended auctions.",
            error,
        });
    }
};


// Controller to update product details
const updateProductController = async (req, res) => {
    const { productId } = req.params;
    const {
      productName,
      productCompany,
      location,
      productType,
      price,
      description1,
      description2,
      description3,
      isOpen,
      endDate,
      images,
    } = req.body;
  
    try {
      // Find and update the product
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        {
          productName,
          productCompany,
          location,
          productType,
          price,
          description1,
          description2,
          description3,
          isOpen,
          endDate,
          images, // Assume `images` is an array of strings (URLs)
        },
        { new: true, runValidators: true } // Return the updated document and validate data
      );
  
      if (!updatedProduct) {
        return res.status(404).json(
            { 
                success: false,
                
                message: "Product not found" }
        );
      }
  
      res.status(200).json({success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({success: false, message: "Failed to update product", error: error.message });
    }
  };
  
//   get all notifications controller
  const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiverId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Notifications retrieved successfully",
            notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving notifications",
            error,
        });
    }
};

// mark as read singel notification
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).send({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error marking notification as read",
            error,
        });
    }
};

// mark allas read notification
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { receiverId: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).send({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error marking all notifications as read",
            error,
        });
    }
};


// get single notification 
const getSingleNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).send({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Notification retrieved successfully",
            notification,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving notification",
            error,
        });
    }
};



module.exports = { addCategoryController,addProductController,getLatestProductsController,getProductByIdController,getAllPostedProductsController,getProductsByCategoryController,getAllProductCategoriesController,addBidController,getPostedBidsController,getProductBidsController,changeBidStatusController,closeBidsOnProductCloseController,endAllAuctionsController,getCategoryByIdController,updateProductController,getAllNotifications,markAsRead,markAllAsRead,getSingleNotification }