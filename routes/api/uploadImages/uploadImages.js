const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");

const Product = require("../../../models/Products");
const auth = require("../../../middleware/auth");

const router = express.Router();

//multer configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}-${Date.now()}.${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype.split("/")[1];
  if (["jpeg", "png"].includes(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error("Not a valid file!!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

//upload Images

router.post(
  "/admin/upload-images",
  upload.array("images", 5),
  [auth],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
      console.log(req.files);
      const fileUrls = req.files?.map((url) => url.path.substr(7));
      console.log(fileUrls);
      res.status(200).json({
        results: { data: fileUrls, msg: "Image uploaded successfully" },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

module.exports = router;
