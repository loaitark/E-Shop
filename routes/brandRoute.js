const router = require("express").Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServices");
const authServices = require("../services/authServices");

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrand
  )
  .delete(authServices.protect, authServices.allowedTo("admin"), deleteBrand);

module.exports = router;
