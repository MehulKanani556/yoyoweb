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
    const userlogout = await user.findByIdAndUpdate(req.params.id);
  } catch (error) {
    console.log("errr logouttt", error);
  }

  return res.status(200).json({
    success: true,
    message: "User logged Out",
  });
};

exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: 400,
        message: "No authorization code provided",
        success: false,
      });
    }

    // Create OAuth client
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'postmessage' // 'postmessage' is important for client-side flow
    );

    try {
      // Exchange the authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      console.log("Google tokens received:", {
        has_access_token: !!tokens.access_token,
        has_refresh_token: !!tokens.refresh_token,
        has_id_token: !!tokens.id_token,
        expires_in: tokens.expires_in
      });

      // Extract tokens
      const { access_token, refresh_token, id_token, expiry_date } = tokens;

      if (!access_token) {
        return res.status(400).json({
          status: 400,
          message: "Failed to obtain access token from Google",
          success: false,
        });
      }

      // Get user info from ID token
      const ticket = await oauth2Client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log("Google user info:", {
        sub: payload.sub,
        email: payload.email,
        name: payload.name
      });

      // Find or create user
      let checkUser = await user.findOne({ email: payload.email });
      if (!checkUser) {
        checkUser = await user.create({
          uid: payload.sub,
          name: payload.name,
          email: payload.email,
          photo: payload.picture,
          googleAccessToken: access_token,
          googleRefreshToken: refresh_token || null, // Store refresh token if available
          googleTokenExpiry: new Date(expiry_date || (Date.now() + (tokens.expires_in * 1000)))
        });
      } else {
        // Update user info with new tokens
        checkUser.googleAccessToken = access_token;
        if (refresh_token) {
          checkUser.googleRefreshToken = refresh_token;
        } else if (access_token) {
          checkUser.googleAccessToken = access_token;
        }
        checkUser.googleTokenExpiry = new Date(expiry_date || (Date.now() + (tokens.expires_in * 1000)));
        await checkUser.save();
      }

      // Check if the plan has expired
      const currentDate = new Date();
      if (checkUser.endDate && currentDate > checkUser.endDate) {
        // Set planType to default if expired
        checkUser.planType = 'Basic'; // or any default value you want
        checkUser.endDate = null;
        checkUser.startDate = null;
        checkUser.Pricing = null;
        await checkUser.save(); // Save the updated user
      }

      // Convert to plain object for response
      checkUser = checkUser.toObject();

      // Create JWT for your app
      let token = jwt.sign(
        { _id: checkUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "1D" }
      );

      // Don't send sensitive information to client
      delete checkUser.googleAccessToken;
      delete checkUser.googleRefreshToken;

      return res.status(200).json({
        status: 200,
        message: "User Login successfully...",
        success: true,
        user: checkUser,
        token: token,
      });
    } catch (tokenError) {
      console.error("Token exchange error:", tokenError);
      return res.status(401).json({
        status: 401,
        message: "Failed to authenticate with Google",
        error: tokenError.message,
        success: false,
      });
    }
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      success: false,
    });
  }
};