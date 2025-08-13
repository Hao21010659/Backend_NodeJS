const mongoose = require("mongoose");

const DichVuSchema = new mongoose.Schema({
  tenDichVu: {
    type: String,
  },
  moTa: {
    type: String,
  },
   giaTien: {
    type: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model("DichVu", DichVuSchema);
