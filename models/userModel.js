const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'use name is required'],
        unique: true
    },
    fullName: {
        type: String,
        // required:[true, 'gender is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    contact: {
        type: String,
        // required:[true, 'state is required']
    },
    userType: {
        type: String,
        // required:[true, 'userType is required'],
        enum: ['seller','buyer', 'admin']
    },


    profile: {
        type: String,
        default: 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
    },
    answer: {
        type: String,
        // required: [true, 'answer is required']
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)