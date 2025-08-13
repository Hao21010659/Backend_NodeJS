const BacSi = require("../../model/BacSi");

// Lấy danh sách tất cả bác sĩ
exports.getAllBacSis = async (req, res) => {
  try {
    const bacSis = await BacSi.find();
    res.json({data: bacSis});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết 1 bác sĩ theo ID
exports.getBacSiById = async (req, res) => {
  try {
    const bacSi = await BacSi.findById(req.params.id);
    if (!bacSi) return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json({data: bacSi});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới bác sĩ
exports.createBacSi = async (req, res) => {
  try {
    const bacSi = new BacSi({
      hoTen: req.body.hoTen,
      chuyenKhoa: req.body.chuyenKhoa,
    });

    const newBacSi = await bacSi.save();
    res.status(201).json({ 
      message: "Tạo bác sĩ thành công", 
      data: newBacSi 
    });
  } catch (err) {
    console.error("Lỗi khi tạo bác sĩ:", err);
    res.status(400).json({
      message: "Lỗi khi tạo bác sĩ",
      error: err.message,
    });
  }
};

// Cập nhật bác sĩ
exports.updateBacSi = async (req, res) => {
  try {
    const bacSi = await BacSi.findById(req.params.id);
    if (!bacSi) {
      return res.status(404).json({
        message: "Không tìm thấy bác sĩ",
      });
    }

    // Cập nhật trường
    if (req.body.hoTen != null) bacSi.hoTen = req.body.hoTen;
    if (req.body.chuyenKhoa != null) bacSi.chuyenKhoa = req.body.chuyenKhoa;

    const updatedBacSi = await bacSi.save();

    res.json({
      message: "Cập nhật bác sĩ thành công",
      data: updatedBacSi,
    });
  } catch (err) {
    res.status(400).json({
      message: "Lỗi khi cập nhật bác sĩ",
      error: err.message,
    });
  }
};

// Xóa bác sĩ
exports.deleteBacSi = async (req, res) => {
  try {
    const bacSi = await BacSi.findById(req.params.id);
    if (!bacSi) {
      return res.status(404).json({
        message: "Không tìm thấy bác sĩ",
      });
    }

    await bacSi.deleteOne();

    res.json({
      message: "Xóa bác sĩ thành công",
      data: bacSi,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi xóa bác sĩ",
      error: err.message,
    });
  }
};