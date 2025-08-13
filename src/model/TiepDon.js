const mongoose = require("mongoose");

const TiepDonSchema = new mongoose.Schema(
  {
    hoTen: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    soDienThoai: {
      type: String,
    },
    gioiTinh: {
      type: String,
      enum: ["boy", "girl", "undetermined"],
    },
    canCuocCongDan: {
      type: String,
    },
    diaChi: {
      type: String,
    },
    ngaySinh: {
      type: Date,
    },
    doiTuong: {
      type: String, // Lưu key như 'Infant', 'adult', ...
      enum: ["Infant", "child", "young", "adult", "Senior"],
    },
    dichVu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DichVu",
    },
    thoiGianHen: {
      type: Date,
    },
    noiDung: {
      type: String,
    },
    bacSi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BacSi",
    },
    trangThai: {
      type: String,
      enum: ["Chờ Khám", "Đã Khám"],
      default: "Chờ Khám",
    },
    maBenhNhan: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TiepDon", TiepDonSchema);
