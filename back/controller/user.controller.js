const user = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require("nodemailer");
const { fileupload } = require('../helper/cloudinary');
const fs = require("fs");
const mongoose = require('mongoose');
const { encryptData } = require('../utils/encryption');

// Initialize Twilio client
let twilioClient;
try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.warn('Twilio credentials not found. SMS functionality will be disabled.');
    } else {
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
} catch (error) {
    console.error('Failed to initialize Twilio client:', error);
}

const generateTokens = async (id) => {
    try {
        const userData = await user.findOne({ _id: id });
        if (!userData) {
            throw new Error("User not found");
        }

        const accessToken = await jwt.sign(
            {
                _id: userData._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: "60m" }
        );

        const refreshToken = await jwt.sign(
            {
                _id: userData._id,
            },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "15d" }
        );

        userData.refreshToken = encryptData(refreshToken);
        await userData.save({ validateBeforeSave: false });

        return {
            accessToken: encryptData(accessToken), // Encrypt accessToken
            refreshToken: userData.refreshToken, // Already encrypted
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createNewUser = async (req, res) => {
    try {
        let { userName, email, password, role, photo } = req.body;

        // Encrypt the sensitive fields
        userName = encryptData(userName);
        email = encryptData(email);

        let chekUser = await user.findOne({ email: req.body.email });

        if (chekUser) {
            return res.json({ status: 400, message: "User Already Exists" });
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.password, salt);

        chekUser = await user.create({
            userName,
            email,
            password: hashPassword,
            role: 'user',
            photo
        });

        const { accessToken, refreshToken } = await generateTokens(chekUser._id);

        return res.status(200).cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000, sameSite: "Strict" })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                sameSite: "Strict",
            })
            .json({
                success: true,
                status: 200,
                message: 'User Register Successfully...',
                user: chekUser,
                token: accessToken,
            });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

//sendOtpEmail
// exports.sendOtpEmail = async (toEmail, otp) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             service: 'gmail',
//             port: 3000,
//             auth: {
//                 user: process.env.MY_GMAIL,
//                 pass: process.env.MY_PASSWORD
//             },
//             tls: {
//                 rejectUnauthorized: false
//             }
//         });

//         await transporter.verify();
//         let mailOptions = {
//             from: process.env.MY_GMAIL,
//             to: toEmail,
//             subject: 'Your Otp Code',
//             text: `Your OTP code is ${otp}`,
//         }

//         await transporter.sendMail(mailOptions);

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: 500, message: error.message });
//     }
// }

// //verifyOtp
// exports.verifyOtp = async (req, res) => {
//     try {
//         const { phoneNo, otp, forgotPass } = req.body;

//         const userData = await user.findOne({ phoneNo });

//         if (!userData) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // First check if OTP expired
//         if (userData.otpExpiry < Date.now()) {
//             return res.status(400).json({ message: 'OTP has expired' });
//         }

//         // Then check if OTP is correct
//         if (userData.otp != otp) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         if (forgotPass) {
//             userData.otp = null;
//             userData.otpExpiry = null;
//             await userData.save();
//             return res.status(200).json({
//                 status: 200,
//                 message: "Otp Verify SuccessFully...",
//                 success: true,
//             });
//         } else {
//             // Update user verification status
//             userData.isVerified = true;
//             userData.otp = null;
//             userData.otpExpiry = null;
//             await userData.save();

//             // Generate JWT token for immediate login
//             const token = jwt.sign({ _id: userData._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

//             return res.status(200).json({
//                 message: 'Registration completed successfully',
//                 token: token,
//                 user: userData,
//                 success: true
//             });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({
                status: 401,
                message: "Page And PageSize Cann't Be Less Than 1",
            });
        }

        let paginatedUser;

        paginatedUser = await user.find();

        let count = paginatedUser.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize;
            let lastIndex = startIndex + pageSize;
            paginatedUser = await paginatedUser.slice(startIndex, lastIndex);
        }

        return res.status(200).json({
            status: 200,
            totalUsers: count,
            message: "All Users Found SuccessFully...",
            user: paginatedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const users = await user.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'premia',
                    localField: 'plan',
                    foreignField: '_id',
                    as: 'planDetails'
                }
            },
            {
                $lookup: {
                    from: 'subscribes', // Assuming the collection name for SubscribeUser is 'subscribes'
                    localField: 'email', // Match user email
                    foreignField: 'email', // Match against email in SubscribeUser
                    as: 'subscriptionDetails'
                }
            },
            { $unwind: { path: "$planDetails", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$subscriptionDetails", preserveNullAndEmptyArrays: true } } // Unwind subscription details
        ]);

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "User found successfully",
                user: {
                    ...users[0], // aggregation returns an array
                    subscribe: users[0].subscriptionDetails?.subscribe // Add subscribe status
                },
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        let photoUrl = undefined;

        // If there's a file uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                // Upload file to Cloudinary
                const uploadResult = await fileupload(req.file.path, 'user-photos');

                if (uploadResult && uploadResult.secure_url) {
                    photoUrl = uploadResult.Location;

                    // Delete the local file after successful upload
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error deleting local file:', err);
                        }
                    });
                } else {
                    throw new Error('Failed to upload file to Cloudinary');
                }
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    status: 500,
                    message: "Failed to upload image to Cloudinary",
                    error: uploadError.message
                });
            }
        }

        // Update user with new data including photo URL
        const updateData = { ...req.body };

        if (typeof updateData.parentalControl === 'string') {
            updateData.parentalControl = updateData.parentalControl.split(',');
            // Optionally, trim spaces
            updateData.parentalControl = updateData.parentalControl.map(s => s.trim());
        }

        // Handle boolean conversions for parental control fields
        if (updateData.isEnabled !== undefined) {
            updateData.isEnabled = updateData.isEnabled === 'true' || updateData.isEnabled === true;
        }
        if (updateData.screenTimeLimit !== undefined) {
            updateData.screenTimeLimit = updateData.screenTimeLimit === 'true' || updateData.screenTimeLimit === true;
        }
        if (updateData.alertWhenLimitExceeded !== undefined) {
            updateData.alertWhenLimitExceeded = updateData.alertWhenLimitExceeded === 'true' || updateData.alertWhenLimitExceeded === true;
        }
        if (updateData.blockInappropriateContent !== undefined) {
            updateData.blockInappropriateContent = updateData.blockInappropriateContent === 'true' || updateData.blockInappropriateContent === true;
        }

        // Handle timelimit field properly
        if (updateData.timelimit !== undefined) {
            // If timelimit is 'null' string, empty string, or null, set it to null
            if (updateData.timelimit === 'null' || updateData.timelimit === '' || updateData.timelimit === null) {
                updateData.timelimit = null;
            } else {
                // If screenTimeLimit is disabled, set timelimit to null
                if (!updateData.screenTimeLimit) {
                    updateData.timelimit = null;
                } else {
                    // Ensure timelimit is a valid string for enabled screen time limit
                    updateData.timelimit = updateData.timelimit.toString();
                }
            }
        }

        // Handle parentalControl array properly
        if (updateData.parentalControl !== undefined) {
            // If blockInappropriateContent is disabled, set parentalControl to empty array
            if (!updateData.blockInappropriateContent) {
                updateData.parentalControl = [];
            } else {
                // If it's enabled, ensure we have valid values
                if (Array.isArray(updateData.parentalControl)) {
                    // Filter out any empty strings or invalid values
                    updateData.parentalControl = updateData.parentalControl.filter(item =>
                        item && item.trim() !== '' && ['U', 'U/A 7+', 'U/A 13+', 'U/A 16+', 'A'].includes(item.trim())
                    );
                } else {
                    updateData.parentalControl = [];
                }
            }
        }

        // Additional logic: If parental control is disabled, clear all related fields
        if (updateData.isEnabled === false) {
            updateData.screenTimeLimit = false;
            updateData.timelimit = null;
            updateData.alertWhenLimitExceeded = false;
            updateData.blockInappropriateContent = false;
            updateData.parentalControl = [];
            updateData.screenTimeUsage = null;
            updateData.screenTimeUsageDate = null;
        }

        if (photoUrl) {
            updateData.photo = photoUrl;
        }

        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User updated successfully",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

exports.removeUser = async (req, res) => {
    try {
        let id = req.params.id

        let removeUser = await user.findById(id);

        if (!removeUser) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id);

        return res.json({ status: 200, success: true, message: "User Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}