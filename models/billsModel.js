const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    sellname: {
      type: String,
      required: true,
    },
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
      default: () =>
        new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    },
  },
  { timestamp: true }
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;
