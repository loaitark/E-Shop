const router = require("express").Router();
const {
  addAddress,
  removeAddress,
  getLoggedUserAdresses,
} = require("../services/addressServices");
const authServices = require("../services/authServices");

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAdresses);

router.delete("/:addresseId", removeAddress);
module.exports = router;
