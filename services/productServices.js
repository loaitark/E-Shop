const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const multerStorge = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorge, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileNmae = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileNmae}`);

    req.body.imageCover = imageCoverFileNmae;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
    next();
  }
});

//@desc get list of products
//@route get/api/v1/products
//@acess public

exports.getProducts = factory.getAll(Product, "Products");

//@desc get specific product by id
//@route get/api/v1/product:id
//acess public
exports.getProduct = factory.getOne(Product, "reviews");
//@desc create product
//@route POST /api/v1/product
//@access private
exports.createProduct = factory.createOne(Product);

//@desc update specific product
//@route  PUT /api/v1/products:id
//@access privte
exports.updateProduct = factory.updateOne(Product);
//@desc Delete specific product
//@route  DElete /api/v1/products:id
//@access privte
exports.deleteProduct = factory.deleteOne(Product);
