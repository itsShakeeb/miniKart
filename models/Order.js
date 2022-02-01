const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Types.ObjectId(),
  },
  item_name: {
    type: String,
    required: true,
  },
  item_price: {
    type: Number,
    required: true,
  },
  item_description: {
    type: String,
    required: true,
  },
  item_quantity: {
    type: [Number],
    required: true,
  },
  buyer_name: {
    type: String,
    required: true,
  },
  buyer_address: {
    type: String,
    required: true,
  },
});

const Orders = mongoose.model("orders", orderSchema);
module.exports = Orders;
