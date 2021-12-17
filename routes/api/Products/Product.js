const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");

const Product = require("../../../models/Products");
const auth = require("../../../middleware/auth");

const router = express.Router();

//multer configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

//Add Product

router.post(
  "/admin/add-product",
  upload.array("product_img_urls", 5),
  [
    auth,

    [
      check("product_name", "Product Name is required").not().isEmpty(),
      check("product_type", "Product type is required").not().isEmpty(),
      check("product_size", "Product Size is required").not().isEmpty(),
      check("product_price", "Product Price is required").not().isEmpty(),
      check("product_color", "Product Color is required").not().isEmpty(),
      check("product_description", "Product Description is required").isLength({
        max: 200,
      }),
    ],
  ],
  async (req, res) => {
    try {
      const {
        product_name,
        product_type,
        product_size,
        product_price,
        product_description,
        product_color,
      } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });

      let item = await Product.findOne({ product_name });

      if (item) res.status(400).json({ msg: "Product is already added" });

      const fileUrls = req.files?.map((url) => url.path);

      item = new Product({
        product_name,
        product_type,
        product_size: product_size.split(","),
        product_price,
        product_description,
        product_color: product_color.split(","),
        product_img_urls: fileUrls,
      });

      await item.save();
      res
        .status(200)
        .json({ results: [{ msg: "Product added successfully" }] });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

//Get all added products

router.get("/admin/all-product", [auth], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const allProducts = await Product.find();
    const products = await Product.find()
      .skip((page - 1) * per_page)
      .limit(per_page);

    res.status(200).json({
      results: [
        {
          msg: "Product list",
          data: products,
          meta: {
            total: allProducts.length,
            currentPage: page,
            perPage: per_page,
          },
        },
      ],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

//update product detail

router.put(
  "/admin/update-product/:product_id",
  [auth, upload.array("product_img_urls", 5)],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const product = await Product.findById({ _id: req.params.product_id });
      const keys = Object.keys(req.body);

      if (!keys) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Key field can't be empty" }] });
      }

      const fileUrls = req.files?.map((url) => url.path);

      product.product_img_urls = fileUrls;
      keys.map((key) => {
        const value = req.body[key];
        if (["product_size", "product_color"].includes(key)) {
          product[key] = value.split(",");
        } else {
          product[key] = value;
        }
      });

      await product.save();
      res
        .status(200)
        .json({ results: [{ msg: "Product updated successfully" }] });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

//delete product

router.delete("/admin/delete-product/:product_id", [auth], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Product.findByIdAndDelete({
      _id: req.params.product_id,
    });

    res.status(200).json({ results: [{ msg: "Deleted successfully" }] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
