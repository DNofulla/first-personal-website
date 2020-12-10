const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 5 },
  image: String,
  description: String,
});

module.exports = mongoose.model("User", user);
