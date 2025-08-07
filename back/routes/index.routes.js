const express = require("express");
const indexRoutes = express.Router();
const {
  removeUser,
  getUserById,
  getAllUsers,
  createNewUser,
  resetPassword,
  verifyOtp,
  sendDeleteOtp,
  verifyDeleteOtp,
  getDevices,
  logoutDevice,
  enableTwoStep,
  verifyTwoStep,
  updateScreenTimeUsage,
  getScreenTimeRemaining,
  updateUser,
} = require("../controller/user.controller");
const {
  userLogin,
  googleLogin,
  forgotPassword,
  changePassword,
  userLogout,
  sendOtpToMobile,
  facebookLogin,
  generateNewToken,
  verifyTwoStepOTP,
} = require("../auth/auth");
const { auth, movieAuth } = require("../middleware/auth");
const {
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
} = require("../controller/Category.Controller");
const { upload, convertJfifToJpeg } = require("../helper/uplodes");
const {
  createContactUs,
  getContactUsById,
  getAllContactUs,
  updateContactUs,
  deleteContactUs,
} = require("../controller/contactUs.Controller");
const {
  createTermsCondition,
  getTermsConditionById,
  getAllTermsCondition,
  updateTermsCondition,
  deleteTermsCondition,
} = require("../controller/TermConditions.controller");
const {
  createprivacyPolicy,
  getprivacyPolicyById,
  getAllprivacyPolicy,
  updateprivacyPolicy,
  deleteprivacyPolicy,
} = require("../controller/PrivacyPolicy.controller");
const {
  createSubscribe,
  getSubscribeById,
  getAllSubscribe,
  updateSubscribe,
  deleteSubscribe,
} = require("../controller/subscribe.controller");

const {
  createPayment,
  getallPayment,
  getPaymentUser,
} = require("../controller/payment.controller");
const csrf = require("csurf");
const { getAllGames, createGame, updateGame, deleteGame } = require("../controller/game.controller");

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  },
});

// CSRF token endpoint (exclude from CSRF protection)
indexRoutes.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF protection to all routes except GET requests and specific endpoints
indexRoutes.use((req, res, next) => {
  // Skip CSRF for GET requests and specific endpoints
  if (
    req.method === "GET" ||
    req.path === "/csrf-token" ||
    req.path.startsWith("/uploads/") ||
    req.path.startsWith("/userLogin") ||
    req.path.startsWith("/google-login") ||
    req.path.startsWith("/facebook-login") ||
    req.path.startsWith("/register") ||
    req.path.startsWith("/logout") ||
    req.path.startsWith("/createUser") ||
    req.path.startsWith("/verifyOtp") ||
    req.path.startsWith("/forgotPassword") ||
    req.path.startsWith("/generateNewTokens") ||
    req.path.startsWith("/createMovie") ||
    req.path.startsWith("/addview")
  ) {
    return next();
  }
  // Apply CSRF protection for other requests
  return csrfProtection(req, res, next);
});

// CSRF error handler
indexRoutes.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.error("CSRF token validation failed for:", req.path, req.method);
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed",
      error: "Invalid CSRF token",
      timestamp: new Date().toISOString(),
    });
  }
  next(err);
});
// auth Routes

indexRoutes.post("/userLogin", userLogin);
indexRoutes.post("/logout/:id", userLogout);
indexRoutes.post("/google-login", googleLogin);
indexRoutes.post("/facebook-login", facebookLogin);
indexRoutes.post("/forgotPassword", forgotPassword);
indexRoutes.post("/changePassword", changePassword);
indexRoutes.post("/otp", sendOtpToMobile);
indexRoutes.post("/verify-two-step", verifyTwoStepOTP);
indexRoutes.post("/generateNewTokens", generateNewToken);
// user Routes

indexRoutes.post("/createUser", createNewUser);
indexRoutes.get("/allUsers", getAllUsers);
indexRoutes.post("/verifyOtp", verifyOtp);
indexRoutes.get("/getUserById/:id", getUserById);
indexRoutes.put(
  "/userUpdate/:id",
  upload.single("photo"),
  csrfProtection,
  updateUser
);
indexRoutes.delete("/deleteUser/:id", csrfProtection, removeUser);
indexRoutes.put("/resetPassword", csrfProtection, resetPassword);
indexRoutes.post("/sendDeleteOtp", csrfProtection, sendDeleteOtp);
indexRoutes.post("/verifyDeleteOtp", csrfProtection, verifyDeleteOtp);
indexRoutes.post("/enableTwoStep", csrfProtection, enableTwoStep);
indexRoutes.post("/verifyTwoStep", csrfProtection, verifyTwoStep);
indexRoutes.post(
  "/screenTimeUsage/:id",
  csrfProtection,
  movieAuth,
  updateScreenTimeUsage
);
indexRoutes.get("/screenTimeRemaining/:id", movieAuth, getScreenTimeRemaining);

//movies Category Routes

indexRoutes.post(
  "/createCategory",
  csrfProtection,
  upload.single("category_image"),
  convertJfifToJpeg,
  createCategory
);
indexRoutes.get("/getCategoryById/:id", getCategoryById);
indexRoutes.get("/getAllCategories", getAllCategories);
indexRoutes.put(
  "/updateCategory/:id",
  csrfProtection,
  upload.single("category_image"),
  convertJfifToJpeg,
  updateCategory
);
indexRoutes.delete("/deleteCategory/:id", csrfProtection, deleteCategory);

//Game 
indexRoutes.get("/getAllGames", getAllGames);
indexRoutes.post(
  "/createGame",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "windows_file", maxCount: 1 },
    { name: "ios_file", maxCount: 1 },
    { name: "android_file", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createGame
);
indexRoutes.put(
  "/updateGame/:id",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "windows_file", maxCount: 1 },
    { name: "ios_file", maxCount: 1 },
    { name: "android_file", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
 updateGame
);
indexRoutes.delete("/deleteGame/:id", deleteGame);


// contactUs

indexRoutes.post("/createContactUs", csrfProtection, createContactUs);
indexRoutes.get("/getContactUsById/:id", getContactUsById);
indexRoutes.get("/getAllContactUs", getAllContactUs);
indexRoutes.put("/updateContactUs/:id", csrfProtection, updateContactUs);
indexRoutes.delete("/deleteContactUs/:id", csrfProtection, deleteContactUs);

// Term Condition

indexRoutes.post("/createTermsCondition", csrfProtection, createTermsCondition);
indexRoutes.get("/getTermsConditionById/:id", getTermsConditionById);
indexRoutes.get("/getAllTermsCondition", getAllTermsCondition);
indexRoutes.put(
  "/updateTermsCondition/:id",
  csrfProtection,
  updateTermsCondition
);
indexRoutes.delete(
  "/deleteTermsCondition/:id",
  csrfProtection,
  deleteTermsCondition
);

// privacyPolicy

indexRoutes.post("/createprivacyPolicy", csrfProtection, createprivacyPolicy);
indexRoutes.get("/getprivacyPolicyById/:id", getprivacyPolicyById);
indexRoutes.get("/getAllprivacyPolicy", getAllprivacyPolicy);
indexRoutes.put(
  "/updateprivacyPolicy/:id",
  csrfProtection,
  updateprivacyPolicy
);
indexRoutes.delete(
  "/deleteprivacyPolicy/:id",
  csrfProtection,
  deleteprivacyPolicy
);

// subscribe
indexRoutes.post("/createsubscribe", csrfProtection, createSubscribe);
indexRoutes.get("/getsubscribeById/:id", getSubscribeById);
indexRoutes.get("/getAllsubscribe", getAllSubscribe);
indexRoutes.put("/updatesubscribe", csrfProtection, updateSubscribe);
indexRoutes.delete("/deletesubscribe/:id", csrfProtection, deleteSubscribe);

// payment
indexRoutes.post("/create-payment", csrfProtection, auth, createPayment);
indexRoutes.get("/getpayment", getallPayment);
indexRoutes.get("/getPaymentUser", auth, getPaymentUser);

// Device management routes
indexRoutes.get("/devices", auth, getDevices);
indexRoutes.post("/logout-device", csrfProtection, auth, logoutDevice);

module.exports = indexRoutes;
