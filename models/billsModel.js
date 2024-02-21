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
    cancelled: {
      type: Boolean,
      default: false, // กำหนดให้มีค่าเริ่มต้นเป็น false
    },
  },
  { timestamp: true }
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;
