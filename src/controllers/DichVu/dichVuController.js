const DichVu = require("../../model/DichVu");

// Lấy danh sách tất cả dịch vụ
exports.getAllDichVu = async (req, res) => {
  try {
    const dichvus = await DichVu.find();
    res.json({data: dichvus});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết 1 dịch vụ theo ID
exports.getDichVuById = async (req, res) => {
  try {
    const dichvu = await DichVu.findById(req.params.id);
    if (!dichvu) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({data: dichvu});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới dịch vụ
exports.createDichVu = async (req, res) => {
  const dichvu = new DichVu({
    tenDichVu: req.body.tenDichVu,
    moTa: req.body.moTa,
    giaTien: req.body.giaTien,
  });

  try {
    const newDichVu = await dichvu.save();
    res.status(201).json({ message: "Đã tạo dịch vụ mới", data: newDichVu });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật dịch vụ
exports.updateDichVu = async (req, res) => {
  try {
    const dichvu = await DichVu.findById(req.params.id);
    if (!dichvu) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });

    if (req.body.tenDichVu != null) dichvu.tenDichVu = req.body.tenDichVu;
    if (req.body.moTa != null) dichvu.moTa = req.body.moTa;
    if (req.body.giaTien != null) dichvu.giaTien = req.body.giaTien; // ✅ thêm giá tiền


    const updatedDichVu = await dichvu.save();
    res.json({ message: "Đã cập nhật dịch vụ", data: updatedDichVu });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa dịch vụ
exports.deleteDichVu = async (req, res) => {
  try {
    const dichvu = await DichVu.findById(req.params.id);
    if (!dichvu) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });

    await dichvu.deleteOne();
    res.json({ message: "Đã xóa dịch vụ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
