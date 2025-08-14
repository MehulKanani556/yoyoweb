// import mongoose from "mongoose";
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'user'
    },
    otp: {
        type: Number,
    },
    otpExpiry: {
        type: Date
    },
    photo: {
        type: String,
    },
    // Shopping cart stored on user document
    cart: [
        {
            game: { type: mongoose.Schema.Types.ObjectId, ref: 'game', required: true },
            platform: { type: String, enum: ['windows', 'ios', 'android'], required: true },
            qty: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true },
            addedAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("User", userSchema);