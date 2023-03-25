const router = require("express").Router();
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrdersForLoggedUser,
  updateOrderToDilverd,
  updateOrderToPaid,
  checkoutSession,
} = require("../services/orderServices");
const authServices = require("../services/authServices");

router.use(authServices.protect);

router.get(
  "/checkout-session/:cartId",
  authServices.allowedTo("user"),
  checkoutSession
);

router.route("/:cartId").post(authServices.allowedTo("user"), createCashOrder);
router.post("/createOrder", (req, res) => {
  res.send("suuccess");
});
router.get(
  "/",
  authServices.allowedTo("admin", "user", "manager"),
  filterOrdersForLoggedUser,
  findAllOrders
);
router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
  authServices.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authServices.allowedTo("admin", "manager"),
  updateOrderToDilverd
);

module.exports = router;
