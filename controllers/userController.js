const userModel = require("../models/userModel");

//login items
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    // ใช้ findOne แทน find เพื่อหาข้อมูลผู้ใช้เพียงรายการเดียว
    const user = await userModel.findOne({ userId });

    if (user && user.password === password) {
      // ถ้าพบผู้ใช้ที่มี userId ตรงกันและมีสถานะ verified เป็น true และ password ตรงกัน
      res.status(200).send(user);
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
    const newUser = new userModel({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("new User added Successfully");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

module.exports = {
  loginController,
  registerController,
};
