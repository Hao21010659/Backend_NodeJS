const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  hoTen: {
    type: String,
  },
  chuyenKhoa: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("BacSi", DoctorSchema);
