const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

//@desc get list of subcategories
//@route get/api/v1/aubcategories
//@acess public
exports.getSubCategories = factory.getAll(SubCategory);

//@desc get specific subcategory by id
//@route get/api/v1/subcategories:id
//acess public
exports.getSubCategory = factory.getOne(SubCategory);

exports.createSubCategory = factory.createOne(SubCategory);

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);
