const mongoose = require("mongoose");

const DungCuSuDungSchema = new mongoose.Schema(
  {
    tenVatDung: {
      type: String,
      required: true,
      trim: true,
    },
    loai: {
      type: String,
      required: true,
    },
    tonKho: {
      type: Number,
      default: 0,
    },
    donVi: {
      type: String,
      required: true,
    },
    nhaCungCap: {
      type: String,
      trim: true,
    },
    trangThai: {
      type: String,
      enum: ["Còn Nhiều", "Trung Bình", "Thấp"],
      default: "Còn Nhiều",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DungCuSuDung", DungCuSuDungSchema);
