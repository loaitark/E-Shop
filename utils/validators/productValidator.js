const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at leatst 3 chars")
    .notEmpty()
    .withMessage("product  required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be num"),
  check("price")
    .isNumeric()
    .notEmpty()
    .withMessage("product price is required")
    .isLength({ max: 32 })
    .withMessage("too long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price after discount must be lower than price");
      }
      return true;
    }),
  check("avaliableColors")
    .optional()
    .isArray()
    .withMessage("avaliable colors should be array of strinf"),
  check("imageCover").notEmpty().withMessage("product imagecover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("image should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to product")
    .isMongoId()
    .withMessage("invalid Id format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("categoryId not avalible");
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalid id format")
    .custom((subcategoriesId) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesId } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesId.length) {
            throw new Error("Invalid sub categories");
          }
          return true;
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesInDB = [];
          subcategories.forEach((subcategory) => {
            subCategoriesInDB.push(subcategory._id.toString());
          });
          if (!val.every((v) => subCategoriesInDB.includes(v))) {
            throw new Error(" sub categories not belong to category");
          }
          return true;
        }
      )
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratings average must be num")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratings quantity must be number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
