const express = require("express");
const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("../controllers/itemController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Change the destination path as needed
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const router = express.Router();

//routes
//Method - get
router.get("/get-item", getItemController);

//method - POST
router.post("/add-item", upload.single("image"), addItemController);
//method - PUT
router.put("/edit-item/:id", upload.single("image"), editItemController); // Added :id parameter for the item ID
//method - delete
router.post("/delete-item", deleteItemController);

module.exports = router;
