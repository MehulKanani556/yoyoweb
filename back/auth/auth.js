const user = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const { encryptData, decryptData } = require("../utils/encryption");

// Initialize Twilio client
let twilioClient;
try {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn(
      "Twilio credentials not found. SMS functionality will be disabled."
    );
  } else {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
} catch (error) {
  console.error("Failed to initialize Twilio client:", error);
}

// ===========================Token===================================

const generateTokens = async (id) => {
  try {
    const userData = await user.findOne({ _id: id });
    // console.log("user", userData);
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

exports.generateNewToken = async (req, res) => {
  const token =
    req.cookies.refreshToken || req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not available",
    });
  }

  jwt.verify(
    token,
    process.env.REFRESH_SECRET_KEY,
    async function (err, decoded) {
      try {
        console.log(err);

        if (err) {
          return res.status(400).json({
            success: false,
            message: "Token invalid",
          });
        }

        const USERS = await user.findOne({ _id: decoded._id });
        console.log("USERSss", USERS);

        if (!USERS) {
          return res.status(404).json({
            success: false,
            message: "User not found..!!",
          });
        }
        const { accessToken, refreshToken } = await generateTokens(decoded._id);

        const userDetails = await user
          .findOne({ _id: USERS._id })
          .select("-password -refreshToken");
        // console.log("userDetailsss", userDetails);

        return res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "Strict",
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            sameSite: "Strict",
          })
          .json({
            success: true,
            finduser: userDetails,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
      } catch (error) {
        return res.status(500).json({
          success: false,
          data: [],
          error: "Error in register user: " + error.message,
        });
      }
    }
  );
};

exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = encryptData(email);

    // let checkEmailIsExist = await user.findOne({ email });

    // if (!checkEmailIsExist) {
    //   return res.status(404).json({ status: 404, message: "Email Not found" });
    // }
    let checkEmailIsExist;

    // Find user by email or phone number
    checkEmailIsExist = await user.findOne({ $or: [{ email: email }, { userName: email }] });

    if (!checkEmailIsExist) {
      return res.status(404).json({
        status: 404,
        message: "Invalid credentials",
      });
    }

    let comparePassword = await bcrypt.compare(
      password,
      checkEmailIsExist.password
    );

    if (!comparePassword) {
      return res
        .status(404)
        .json({ status: 404, message: "Password Not Match" });
    }

    const { accessToken, refreshToken } = await generateTokens(checkEmailIsExist._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000, sameSite: "Strict" })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "Strict",
      })
      .json({
        success: true,
        status: 200,
        message: "User Login SuccessFully...",
        user: checkEmailIsExist, token: accessToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    const encryptEmail = encryptData(email);

    let checkEmail = await user.findOne({ email: encryptEmail });

    if (!checkEmail) {
      return res.status(404).json({ status: 404, message: "Email Not Found" });
    }

    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Your code is: ${otp} `,
    };

    checkEmail.otp = otp;

    await checkEmail.save();

    transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log("Error sending email:", error);
        return res
          .status(500)
          .json({ status: 500, success: false, message: error.message });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Email Sent SuccessFully...",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    const encryptEmail = encryptData(email);

    let chekcEmail = await user.findOne({ email: encryptEmail });

    if (!chekcEmail) {
      return res.status(404).json({ status: 404, message: "Email Not Found" });
    }

    if (chekcEmail.otp != otp) {
      return res.status(404).json({ status: 404, message: "Invalid Otp" });
    }

    chekcEmail.otp = undefined;

    await chekcEmail.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Otp Verify SuccessFully...",
      user: chekcEmail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let { newPassword, email } = req.body;
    const encryptEmail = encryptData(email);

    let userId = await user.findOne({ email: encryptEmail });

    if (!userId) {
      return res.status(404).json({ status: 404, message: "User Not Found" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(newPassword, salt);

    let updatePassword = await user.findByIdAndUpdate(
      userId._id,
      { password: hashPassword },
      { new: true }
    );

    return res.json({
      status: 200,
      success: true,
      message: "Password Changed SuccessFully...",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.userLogout = async (req, res) => {
  try {
    const logout = await user.findByIdAndUpdate(req.params.id);
  } catch (error) {
    console.log("errr logouttt", error);
  }

  return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
      success: true,
      message: "User logged Out",
    });
};

exports.googleLogin = async (req, res) => {
  try {
    let { uid, userName, fullName, email, photo } = req.body;

    userName = encryptData(userName);
    fullName = encryptData(fullName);
    email = encryptData(email);


    let checkUser = await user.findOne({ email });
    if (!checkUser) {
      checkUser = await user.create({
        uid,
        userName,
        fullName,
        email,
        photo,
        role: "user",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(checkUser._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "None",
      })
      .json({
        message: "login successful",
        success: true,
        user: checkUser,
        token: accessToken,
        refreshToken: refreshToken,
      });
  } catch (error) {
    throw new Error(error);
  }
};