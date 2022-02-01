const express = require("express");
const multer = require("multer");
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Category = require("../../../models/Category");
const router = express.Router();
const upload = multer();

router.post(
  "/admin/add-category",
  [auth, check("category_name", "Category name is required"), upload.none()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
      const { category_name } = req.body;
      let category = await Category.findOne({ category_name });
      let allCategory = await Category.find();
      if (category)
        res.status(400).json({
          results: {
            msg: "Category already added",
          },
        });
      category = new Category({
        id: allCategory.length + 1,
        category_name,
      });
      await category.save();
      res.status(200).json({ results: { msg: "Category added successfully" } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: { msg: "Server Error" } });
    }
  }
);

router.get("/admin/get-category", [auth, upload.none()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
    let categories = await Category.find();
    res.status(200).json({
      results: {
        msg: "All categories",
        data: categories,
        length: categories.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
});

module.exports = router;
