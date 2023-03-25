const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

exports.sigup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXP_TIME,
  });

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //console.log(req.body, user);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw next(new ApiError("Incorrect passwotd or email"));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXP_TIME,
  });

  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  //check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    //  console.log(token);
  }
  if (!token) {
    throw next(
      new ApiError("you are not login , please login and try agin", 404)
    );
  }

  //vervify tokenno change happens , expierd token
  const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
  //check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    throw next(new ApiError("this user is no longer exist"), 401);
  }

  //check if user change password after get token
  if (currentUser.passwordChangedAt) {
    const passwodChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwodChangedTimeStamp > decoded.iat) {
      throw next(new ApiError("user changed recently password"), 401);
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw next(new ApiError("you are not allowed to access this role"), 403);
    }

    next();
  });
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`cant find you email ${req.body.email}`));
  }

  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");

  user.passwordRestCode = hashedRestCode;
  user.passwordRestExp = Date.now() + 10 * 60 * 1000;
  console.log(user.passwordRestExp);
  user.passwordResetVerify = false;

  ////
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${restCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordRestCode = undefined;
    user.passwordRestExp = undefined;
    user.passwordResetVerify = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  await user.save();
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});
//   await sendEmail({
//     email: user.email,
//     subject: "your rest code valid for 10 min ",
//     message: `hi ${user.name} this is your rest code ${restCode}`,
//   });

//   res
//     .status(200)
//     .json({ status: "success", message: "rest code sent to email" });
// });
exports.verifyPassRestCode = asyncHandler(async (req, res, next) => {
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  const user = await User.findOne({
    passwordRestCode: hashedRestCode,
    passwordRestExp: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("rest code invalid or exp"));
  }

  user.passwordResetVerify = true;
  await user.save();

  res.status(200).json({ status: "succes" });
});

exports.restPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("there is no user id for this user"), 404);
  }
  if (!user.passwordResetVerify) {
    return next(new ApiError("rest code not verified"), 400);
  }
  user.password = req.body.newPassword;
  user.passwordRestCode = undefined;
  user.passwordRestExp = undefined;
  user.passwordResetVerify = undefined;

  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXP_TIME,
  });

  res.status(200).json({ token });
});
