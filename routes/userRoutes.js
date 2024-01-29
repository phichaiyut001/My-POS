const express = require("express");
const {
  loginController,
  registerController,
  getUsersController,
  editUsersController,
  deleteUserController,
  changePasswordController,
} = require("../controllers/userController");

const router = express.Router();

//routes
//Method - get
router.post("/login", loginController);
router.get("/get-users", getUsersController);

//method - POST
router.post("/register", registerController);
router.put("/edit-users/:id", editUsersController);
router.post("/delete-users", deleteUserController);

module.exports = router;
