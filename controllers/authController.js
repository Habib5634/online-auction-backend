const userModel = require('../models/userModel')
const bcrypt = require("bcryptjs")
const JWT = require('jsonwebtoken')


// REGISTER
const registerController = async (req, res) => {
    try {
        const { userName, fullName, email, password, contact, userType, answer } = req.body
        // validation
        if (!userName || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'please provide required fields'
            })
        }
        // user exist!!!
        const existing = await userModel.findOne({ userName })
        if (existing) {
            return res.status(500).send({
                success: false,
                message: "UserName Already taken"
            })
        }
        // user exist!!!
        const existingEmail = await userModel.findOne({ email })
        if (existingEmail) {
            return res.status(500).send({
                success: false,
                message: "Email Already taken"
            })
        }

        // hashing password
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userPayload ={
            userName, fullName, email, password: hashedPassword, contact, userType, answer
        }

         // Filter out empty fields from the payload
      Object.keys(userPayload).forEach((key) => {
        if (!userPayload[key]) {
          delete userPayload[key];
        }
      });
        // save user
        const user = await userModel.create(userPayload);
        res.status(201).send({
            success: true,
            message: "Successfully Registered",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in register API",
            error
        })
    }
}


// Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(500).send({
                succes: false,
                message: "email or password is missing",
                error
            })

        }

        // check user  and compare password
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'use Not Found'
            })
        }

        // check user password | compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Password"
            })
        }
        // create token
        const token = JWT.sign({ _id: user._id, userName: user.userName, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "7d" })


        // for hiding password in response
        user.password = undefined

        res.status(200).send({
            success: true,
            mesage: "Login Succesfully",
            user,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Login API",
            error,
        });
    }
}
// get user profile controller
const getUserController = async (req, res) => {
    try {
        // find User
        const user = await userModel.findById({ _id: req.user._id })
        // validation
        if (!user) {
            res.status(500).send({
                success: false,
                message: "User Not Found",
                error,
            });
        }
        // for hiding the password in response
        user.password = undefined


        res.status(200).send({
            success: true,
            mesage: "Login Succesfully",
            user
        })
        // console.log(req.user._id)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In getUser API",
            error,
        });
    }

}


// UPDATE USER
const updateUserController = async (req, res) => {
    try {
        // Find user
        const user = await userModel.findById({ _id: req.user._id });

        // Validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Update fields
        const { userName, fullName,contact,profile } = req.body;

        if (userName) user.userName = userName;
        if (fullName) user.fullName = fullName;
        if (contact) user.contact = contact;
        if (profile) user.profile = profile;

        

        // Save user
        await user.save();

        // Hide password in response
        user.password = undefined;

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update User API",
            error,
        });
    }
};


// UPDATE USER PASSWORR
const updatePasswordController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({ _id: req.user._id });
        //valdiation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Usre Not Found",
            });
        }
        // get data from user
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Old or New PasswOrd",
            });
        }
        //check user password  | compare password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid old password",
            });
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Password Update API",
            error,
        });
    }
};

// RESET PASSWORd
const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body;
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: "Please Privide All Fields",
            });
        }
        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found or invlaid answer",
            });
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Reset SUccessfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "eror in PASSWORD RESET API",
            error,
        });
    }
};






module.exports = { registerController, loginController, getUserController, updateUserController, updatePasswordController, resetPasswordController }

