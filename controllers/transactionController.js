const transactionModel = require('../models/transactionModel');
const Notification = require('../models/notificationModel');
const productModel = require('../models/productModel')

// Create a transaction
const createTransaction = async (req, res) => {
    const { sellerId, productId, amount } = req.body;
    const buyerId = req.user._id; // Assuming buyerId is retrieved from req.user
    const buyerName = req.user.userName; // Assuming req.user includes buyer's name

    try {
        // Fetch the product details
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const transaction = new transactionModel({ buyerId, sellerId, productId, amount });
        await transaction.save();

        // Notify seller
        const notificationMessage = `${buyerName} sent you a transaction of $${amount} for the product "${product.productName}". Please check your account and confirm the payment.`;
        const notification = new Notification({
            senderId: buyerId,
            receiverId: sellerId,
            message: notificationMessage,
        });
        await notification.save();

        res.status(201).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating transaction', error });
    }
};

// Update a transaction status
const updateTransactionStatus = async (req, res) => {
    const { transactionId } = req.params;
    const { status } = req.body;
    const sellerId = req.user._id; // Assuming sellerId is retrieved from req.user

    try {
        const transaction = await transactionModel.findById(transactionId).populate('productId buyerId');
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        // Update transaction status
        transaction.status = status;
        await transaction.save();

        // Notify buyer about the status change
        const productName = transaction.productId.name;
        const notificationMessage = `Your transaction for the product "${productName}" has been ${status} by the seller.`;
        const notification = new Notification({
            senderId: sellerId,
            receiverId: transaction.buyerId._id,
            message: notificationMessage,
        });
        await notification.save();

        res.status(200).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating transaction status', error });
    }
};

// Get all transactions for admin
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find()
            .populate('buyerId', 'fullName email') // Populating buyer's name and email
            .populate('sellerId', 'fullName email') // Populating seller's name and email
            .populate('productId', 'productName'); // Populating product name

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in fetching transactions",
            error
        })
    }
};


const getBuyerTransactions = async (req, res) => {
    const buyerId = req.user._id; // Assuming `req.user` contains authenticated user's details

    try {
        const transactions = await transactionModel.find({ buyerId })
            .populate('sellerId', 'fullName email') // Seller details
            .populate('productId', 'productName'); // Product details

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.error('Error fetching buyer transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching buyer transactions',
            error,
        });
    }
};


const getSellerTransactions = async (req, res) => {
    const sellerId = req.user._id; // Assuming `req.user` contains authenticated user's details

    try {
        const transactions = await transactionModel.find({ sellerId })
            .populate('buyerId', 'fullName email') // Buyer details
            .populate('productId', 'productName'); // Product details

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.error('Error fetching seller transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching seller transactions',
            error,
        });
    }
};


// Get a transaction by ID
const getTransactionById = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await transactionModel.findById(transactionId)
        .populate('buyerId', 'fullName email') // Populating buyer's name and email
        .populate('sellerId', 'fullName email') // Populating seller's name and email
        .populate('productId', 'productName');  // Populating product name

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        res.status(200).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching transaction', error });
    }
};


const deleteTransaction = async (req, res) => {
    const { id } = req.params; // Extract transaction ID from request params

    try {
        const transaction = await transactionModel.findById(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

     

        await transactionModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error,
        });
    }
};

module.exports = {
    createTransaction,
    updateTransactionStatus,
    getAllTransactions,
    getTransactionById,
    getBuyerTransactions,
    getSellerTransactions,
    deleteTransaction
};


