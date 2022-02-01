const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");

const Orders = require("../../../models/Order");

const router = express.Router();

//create order
router.post(
  "/create-order",
  [
    auth,
    [
      check("item_name", "Item name is required").not().isEmpty(),
      check("item_price", "Item price is required").not().isEmpty(),
      check("item_description", "Item description is required").not().isEmpty(),
      check("item_quantity", "Item name is required").not().isEmpty(),
      check("buyer_name", "Buyer name is required").not().isEmpty(),
      check("buyer_address", "Buyer address is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        item_name,
        item_price,
        item_description,
        item_quantity,
        buyer_name,
        buyer_address,
      } = req.body;

      const item = await Orders.find();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

module.exports = router;
