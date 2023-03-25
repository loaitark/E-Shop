const router = require("express").Router();
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistServies");
const authServices = require("../services/authServices");

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);
module.exports = router;
