const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  sigup,
  login,
  forgetPassword,
  verifyPassRestCode,
  restPassword,
} = require("../services/authServices");

const router = express.Router();

router.route("/signup").post(signupValidator, sigup);
router.route("/login").post(loginValidator, login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyRestCode").post(verifyPassRestCode);
router.route("/restPassword").put(restPassword);
// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
