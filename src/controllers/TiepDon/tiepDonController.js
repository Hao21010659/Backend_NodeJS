const TiepDon = require("../../model/TiepDon");

// Lấy danh sách tất cả tiếp đón
exports.getAllTiepDon = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10  } = req.query;

    const filter = {};

    if (keyword) {
        filter.$or = [
            { hoTen: { $regex: keyword, $options: "i" } },
            { soDienThoai: { $regex: keyword, $options: "i" } },
            { canCuocCongDan: { $regex: keyword, $options: "i" } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Đếm tổng số kết quả
    const total = await TiepDon.countDocuments(filter);

    const tiepDons = await TiepDon.find(filter)
      .populate("dichVu")
      .populate("bacSi")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      message: "Lấy danh sách tiếp đón thành công",
      data: tiepDons,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tiếp đón",
      error: err.message,
    });
  }
};


// Lấy chi tiết 1 tiếp đón theo ID
exports.getTiepDonById = async (req, res) => {
  try {
    const tiepDon = await TiepDon.findById(req.params.id)
      .populate("dichVu")
      .populate("bacSi");

    if (!tiepDon) {
      return res.status(404).json({
        message: "Không tìm thấy tiếp đón",
      });
    }

    res.json({
      message: "Lấy chi tiết tiếp đón thành công",
      data: tiepDon,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy chi tiết tiếp đón",
      error: err.message,
    });
  }
};

// Tạo mới tiếp đón
exports.createTiepDon1 = async (req, res) => {
    
  const tiepDon = new TiepDon({
    hoTen: req.body.hoTen,
    email: req.body.email,
    soDienThoai: req.body.soDienThoai,
    gioiTinh: req.body.gioiTinh,
    canCuocCongDan: req.body.canCuocCongDan,
    diaChi: req.body.diaChi,
    ngaySinh: req.body.ngaySinh,
    doiTuong: req.body.doiTuong, 
    dichVu: req.body.dichVu,
    thoiGianHen: req.body.thoiGianHen,
    noiDung: req.body.noiDung,
    bacSi: req.body.bacSi,
  });

  try {
    const newTiepDon = await tiepDon.save();
    res.status(201).json({
      message: "Tạo tiếp đón thành công",
      data: newTiepDon,
    });
  } catch (err) {
    res.status(400).json({
      message: "Lỗi khi tạo tiếp đón",
      error: err.message,
    });
  }
};
exports.createTiepDon = async (req, res) => {
  try {
    // Tìm bệnh nhân mới nhất (sắp xếp theo createdAt giảm dần)
    const lastPatient = await TiepDon.findOne().sort({ createdAt: -1 });

    let newCodeNumber = 1;

    if (lastPatient && lastPatient.maBenhNhan) {
        // Lấy 4 số cuối
        const match = lastPatient.maBenhNhan.match(/BN(\d{4})/);
        if (match) {
            newCodeNumber = parseInt(match[1], 10) + 1;
        }
    }

    // Format thành BN0001
    const newMaBenhNhan = `BN${newCodeNumber.toString().padStart(4, "0")}`;

    const tiepDon = new TiepDon({
        hoTen: req.body.hoTen,
        email: req.body.email,
        soDienThoai: req.body.soDienThoai,
        gioiTinh: req.body.gioiTinh,
        canCuocCongDan: req.body.canCuocCongDan,
        diaChi: req.body.diaChi,
        ngaySinh: req.body.ngaySinh,
        doiTuong: req.body.doiTuong,
        dichVu: req.body.dichVu,
        thoiGianHen: req.body.thoiGianHen,
        noiDung: req.body.noiDung,
        bacSi: req.body.bacSi,
        maBenhNhan: newMaBenhNhan,
    });

    const newTiepDon = await tiepDon.save();

    res.status(201).json({
        message: "Tạo tiếp đón thành công",
        data: newTiepDon,
    });
  } catch (err) {
    console.error("Lỗi khi tạo tiếp đón:", err);
    res.status(400).json({
        message: "Lỗi khi tạo tiếp đón",
        error: err.message,
    });
  }
};


// Cập nhật tiếp đón
exports.updateTiepDon = async (req, res) => {
  try {
    const tiepDon = await TiepDon.findById(req.params.id);
    if (!tiepDon) {
      return res.status(404).json({
        message: "Không tìm thấy tiếp đón",
      });
    }

    // Cập nhật trường
    if (req.body.hoTen != null) tiepDon.hoTen = req.body.hoTen;
    if (req.body.email != null) tiepDon.email = req.body.email;
    if (req.body.soDienThoai != null) tiepDon.soDienThoai = req.body.soDienThoai;
    if (req.body.gioiTinh != null) tiepDon.gioiTinh = req.body.gioiTinh;
    if (req.body.canCuocCongDan != null) tiepDon.canCuocCongDan = req.body.canCuocCongDan;
    if (req.body.diaChi != null) tiepDon.diaChi = req.body.diaChi;
    if (req.body.ngaySinh != null) tiepDon.ngaySinh = req.body.ngaySinh;
    if (req.body.doiTuong != null) tiepDon.doiTuong = req.body.doiTuong;
    if (req.body.dichVu != null) tiepDon.dichVu = req.body.dichVu;
    if (req.body.thoiGianHen != null) tiepDon.thoiGianHen = req.body.thoiGianHen;
    if (req.body.noiDung != null) tiepDon.noiDung = req.body.noiDung;
    if (req.body.bacSi != null) tiepDon.bacSi = req.body.bacSi;
    if (req.body.trangThai != null) tiepDon.trangThai = req.body.trangThai;

    const updatedTiepDon = await tiepDon.save();

    res.json({
      message: "Cập nhật tiếp đón thành công",
      data: updatedTiepDon,
    });
  } catch (err) {
    res.status(400).json({
      message: "Lỗi khi cập nhật tiếp đón",
      error: err.message,
    });
  }
};

// Xóa tiếp đón
exports.deleteTiepDon = async (req, res) => {
  try {
    const tiepDon = await TiepDon.findById(req.params.id);
    if (!tiepDon) {
      return res.status(404).json({
        message: "Không tìm thấy tiếp đón",
      });
    }

    await tiepDon.deleteOne();

    res.json({
      message: "Xóa tiếp đón thành công",
      data: tiepDon,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi xóa tiếp đón",
      error: err.message,
    });
  }
};
