const itemModel = require("../models/itemModel");

const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      image: req.file.filename, // Save the filename in the database
    });

    await newItem.save();
    res.status(201).send("Item Created Successfully");
  } catch (error) {
    res.status(400).send("Error", error);
    console.log(error);
  }
};

//get items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
  }
};

// edit item
const editItemController = async (req, res) => {
  try {
    const { id } = req.params; // Changed from req.body.itemId to req.params.id
    console.log(id);

    const updatedItem = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    };

    if (req.file) {
      updatedItem.image = req.file.filename;
    }

    await itemModel.findOneAndUpdate({ _id: id }, updatedItem, {
      new: true,
    });

    res.status(201).json("Item Updated");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;

    await itemModel.findOneAndDelete({ _id: itemId });

    res.status(200).json("item Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
