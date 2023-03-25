const { check, body } = require("express-validator");

const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("too short User name")
    .isLength({ max: 32 })
    .withMessage("too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email")
    .custom((val) => {
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-MAIL aleard in user"));
        }
      });
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password reqired")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charc")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Passord confirm  incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required"),
  validatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email"),
  check("password")
    .notEmpty()
    .withMessage("password reqired")
    .isLength({ min: 6 })
    .withMessage("wrong Password"),
  validatorMiddleware,
];
