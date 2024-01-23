const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    subTotal: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
    },
    changeAmount: {
      type: Number,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    cartItems: {
      type: Array,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamp: true }
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;