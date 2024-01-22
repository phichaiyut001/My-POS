const express = require("express");
const {
  addBillsController,
  getBillsController,
} = require("../controllers/billsController");

const router = express.Router();

//method - POST
router.post("/add-bills", addBillsController);

//method - Get
router.get("/get-bills", getBillsController);

module.exports = router;
