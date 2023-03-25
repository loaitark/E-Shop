const multer = require("multer");
const ApiError = require("../utils/apiError");

//const multerStorge = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

exports.uploadSingleImage = (fieldName) => {
  const multerStorge = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorge, fileFilter: multerFilter });

  return upload.single(fieldName);
};
