const billsModel = require("../models/billsModel");
//add items
const addBillsController = async (req, res) => {
  try {
    const newBill = new billsModel(req.body);
    await newBill.save();
    res.send("Bill Create Successfully");
  } catch (error) {
    res.send("Something went wrong");
    console.log(error);
  }
};

//get bills date
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};

const deleteBillsController = async (req, res) => {
  try {
    const { billsid } = req.body;

    await billsModel.findOneAndDelete({ _id: billsid });

    res.status(200).json("item Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const cancelbills = async (req, res) => {
  try {
    const { billId } = req.body;
    await billsModel.findByIdAndUpdate(billId, { cancelled: true });
    res.status(200).send("Bill cancelled successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error cancelling bill");
  }
};

module.exports = {
  addBillsController,
  getBillsController,
  deleteBillsController,
  cancelbills,
};
