const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    UserId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
  },
  { timestamp: true }
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
