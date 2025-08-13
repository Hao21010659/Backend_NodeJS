const mongoose = require("mongoose");

const PhieuKhamSchema = new mongoose.Schema(
  {
    tiepDon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TiepDon",
      required: true,
    },
    // Sinh hiệu
    mach: String,
    nhietDo: String,
    huyetAp: String,
    nhipTho: String,
    canNang: String,
    chieuCao: String,
    bmi: String,

    // Hỏi bệnh
    tienSuBenh: String,

    // Khám bệnh
    khamToanThan: String,
    khamBoPhan: String,
    luuY: String,

    // Chẩn đoán
    chanDoanSoBo: String,
    chanDoanChinh: String,
    chanDoanKemTheo: String,
    moTaChiTiet: String,

     // Chẩn đoán trước mổ
    chanDoanTruocMo: String,

    // Chỉ định phẫu thuật/thủ thuật
    chiDinhPhauThuat: String,

    // Tên phẫu thuật/thủ thuật
    tenPhauThuat: String,

    // Phương pháp vô cảm
    phuongPhapVoCam: String,

    // Thời gian
    thoiGianBatDau: Date,
    thoiGianKetThuc: Date,

    // Kíp mổ
    kipMo: String,

    // Dụng cụ sử dụng (liên kết DungCuSuDung)
    dungCuSuDung: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DungCuSuDung",
      },
    ],

    // Mô tả quá trình phẫu thuật/thủ thuật
    moTaQuaTrinh: String,

    // Kết quả/phát hiện trong mổ
    ketQuaTrongMo: String,

    // Biến chứng
    bienChung: String,

    // Hướng điều trị sau mổ
    huongDieuTriSauMo: String,

    // Kết luận
    ketLuanSauMo: String,

    // Chỉ định điều trị tiếp theo
    chiDinhDieuTriTiepTheo: String,

    // Kết luận
    ketLuan: String,

    // Chỉ định
    chiDinh: {
      type: String,
      enum: ["1", "2", "3"], // 1: Thủ thuật - phẫu thuật, 2: Điều trị dài hạn, 3: Không có chỉ định
    },

    trangThai: {
      type: String,
      enum: ["Chờ Thực Hiện", "Đã Hoàn Thành"],
      default: "Chờ Thực Hiện",
    },

    fileKetQua: String,

    // Thông tin thanh toán
    thanhToan: { type: Number },
    
    trangThaiThanhToan: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("PhieuKham", PhieuKhamSchema);
