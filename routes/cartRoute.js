const router = require("express").Router();
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartServices");
const authServices = require("../services/authServices");

router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/:applyCoupon", applyCoupon);
router.route("/:itemId").put(updateCartItemQuantity).delete(removeSpecificItem);

module.exports = router;
