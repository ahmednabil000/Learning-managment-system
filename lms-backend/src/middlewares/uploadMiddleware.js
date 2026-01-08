const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  // Use file system for temporary storage
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB Limit
});

module.exports = upload;
