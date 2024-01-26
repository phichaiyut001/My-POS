const express = require("express");
const {
  addBillsController,
  getBillsController,
  deleteBillsController,
} = require("../controllers/billsController");

const router = express.Router();

//method - POST
router.post("/add-bills", addBillsController);

//method - Get
router.get("/get-bills", getBillsController);

router.post("/delete-bills",deleteBillsController)

module.exports = router;
