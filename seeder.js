const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connecDb = require("./config/config");
const itemModel = require("./models/itemModel");
const items = require("./utils/pos.items.json");
require("colors");
//config
dotenv.config();
connecDb();

//function seeder
const importData = async () => {
  try {
    await itemModel.deleteMany();
    const itemsData = await itemModel.insertMany(items);
    console.log("All Item Added".bgGreen);
    process.exit();
  } catch (error) {
    console.log(`${error}`.bgRed.inverse);
    process.exit(1);
  }
};

importData();
