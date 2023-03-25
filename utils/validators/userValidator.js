const { check, body } = require("express-validator");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcrypt");

const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone num"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  body("name").custom((val, { req }) => {
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
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone num"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error("there is no user for this id");
      }

      const isCorrectPass = await bcrypt.compare(val, user.password);

      if (!isCorrectPass) {
        throw new Error("Icorrect current password");
      }

      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter your password confirm")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passord confirm  incorrect");
      }
      return true;
    }),
  check("password").notEmpty().withMessage("you must enter your new password"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];

exports.updateLoggedUserVlaidator = [
  body("name").optional(),
  check("email")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone num"),
  validatorMiddleware,
];
