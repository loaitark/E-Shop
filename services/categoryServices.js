const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }

  next();
});

//@desc get list of categories
//@route get/api/v1/categories
//@acess public
exports.getCategories = factory.getAll(Category);

//@desc get specific category by id
//@route get/api/v1/categories:id
//acess public
exports.getCategory = factory.getOne(Category);
//@desc create category
//@route POST /api/v1/categories
//@access private

exports.createCategory = factory.createOne(Category);

//@desc update specific cateogry
//@route  PUT /api/v1/categories:id
//@access privte
exports.updateCategory = factory.updateOne(Category);

//@desc Delete specific cateogry
//@route  DElete /api/v1/categories:id
//@access privte
exports.deleteCategory = factory.deleteOne(Category);
