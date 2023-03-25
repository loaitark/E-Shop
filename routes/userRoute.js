const express = require("express");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserVlaidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserDate,
  deleteLoggedUserData,
} = require("../services/userServices");

const authServices = require("../services/authServices");

const router = express.Router();

router.get("/getMe", authServices.protect, getLoggedUserData, getUser);
router.put("/changeMyPassword", authServices.protect, updateLoggedUserPassword);
router.put(
  "/updateMe",
  authServices.protect,
  updateLoggedUserVlaidator,
  updateLoggedUserDate
);
router.delete("/deleteMe", authServices.protect, deleteLoggedUserData);

router.use(authServices.protect, authServices.allowedTo("admin", "manager"));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
