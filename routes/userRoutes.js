const express = require("express");
const {
  loginController,
  registerController,
  getUsersController,
} = require("../controllers/userController");

const router = express.Router();

//routes
//Method - get
router.post("/login", loginController);
router.get("/get-users", getUsersController);

//method - POST
router.post("/register", registerController);

module.exports = router;
