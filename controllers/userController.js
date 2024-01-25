const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
//login items
const loginController = async (req, res) => {
  try {
    const { UserId, password } = req.body;
    // ใช้ findOne แทน find เพื่อหาข้อมูลผู้ใช้เพียงรายการเดียว
    const user = await userModel.findOne({ UserId });

    if (user && (await bcrypt.compare(password, user.password))) {
      // ถ้าพบผู้ใช้ที่มี userId ตรงกันและมีสถานะ verified เป็น true และ password ตรงกัน
      res.status(200).send(user);
      console.log("User Found:", user);
    } else {
      // ถ้าไม่พบผู้ใช้หรือ userId หรือ password ไม่ตรงกัน หรือผู้ใช้ไม่มีสถานะ verified เป็น true
      res.status(401).json({
        message: "Login Fail",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//register items
const registerController = async (req, res) => {
  try {
    const { password, UserId, ...otherFields } = req.body;

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // ตรวจสอบว่า UserId ซ้ำหรือไม่
    const existingUser = await userModel.findOne({ UserId });

    if (existingUser) {
      return res.status(400).send("UserId already exists.");
    }

    // สร้าง user ใหม่โดยใช้รหัสผ่านที่ถูกเข้ารหัสแล้ว
    const newUser = new userModel({
      UserId,
      password: hashedPassword,
      ...otherFields,
      verified: true,
    });
    await newUser.save();

    res.status(201).send("New user added successfully");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

const getUsersController = async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginController,
  registerController,
  getUsersController,
};
