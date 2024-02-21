const express = require("express");
const {
  addBillsController,
  getBillsController,
  deleteBillsController,
  cancelbills,
} = require("../controllers/billsController");

const router = express.Router();

//method - POST
router.post("/add-bills", addBillsController);

//method - Get
router.get("/get-bills", getBillsController);

router.post("/delete-bills", deleteBillsController);

router.put("/cancel-bills", cancelbills);

module.exports = router;
