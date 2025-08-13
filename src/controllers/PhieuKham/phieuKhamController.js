const DungCuSuDung = require("../../model/DungCuSuDung");
const PhieuKham = require("../../model/PhieuKham");
const TiepDon = require("../../model/TiepDon");

exports.createPhieuKham = async (req, res) => {
  try {
    const phieuKham = new PhieuKham({
      tiepDon: req.body.tiepDon, // ID của tiếp đón

      mach: req.body.mach,
      nhietDo: req.body.nhietDo,
      huyetAp: req.body.huyetAp,
      nhipTho: req.body.nhipTho,
      canNang: req.body.canNang,
      chieuCao: req.body.chieuCao,
      bmi: req.body.bmi,

      tienSuBenh: req.body.tienSuBenh,

      khamToanThan: req.body.khamToanThan,
      khamBoPhan: req.body.khamBoPhan,
      luuY: req.body.luuY,

      chanDoanSoBo: req.body.chanDoanSoBo,
      chanDoanChinh: req.body.chanDoanChinh,
      chanDoanKemTheo: req.body.chanDoanKemTheo,
      moTaChiTiet: req.body.moTaChiTiet,

      ketLuan: req.body.ketLuan,
      chiDinh: req.body.chiDinh,
    });

    const savedPhieuKham = await phieuKham.save();

    res.status(201).json({
      message: "Tạo phiếu khám thành công",
      data: savedPhieuKham,
    });
  } catch (error) {
    console.error("Lỗi tạo phiếu khám:", error);
    res.status(500).json({
      message: "Lỗi server khi tạo phiếu khám",
      error: error.message,
    });
  }
};

// Lấy danh sách phiếu khám
exports.getAllPhieuKham = async (req, res) => {
  try {
    // Lấy page và limit từ query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Đếm tổng số bản ghi
    const totalRecords = await PhieuKham.countDocuments();

    // Lấy danh sách
    const list = await PhieuKham.find()
      .populate({
        path: "tiepDon",
        populate: [
          { path: "dichVu" },
          { path: "bacSi" }
        ]
      })
      .populate("dungCuSuDung")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: list,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      }
    });
  } catch (error) {
    console.error("Lỗi getAllPhieuKham:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách",
      error: error.message,
    });
  }
};


// Cập nhật phiếu khám
exports.updatePhieuKham = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Cập nhật phiếu khám
    const updated = await PhieuKham.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }

    // 2. Cập nhật trạng thái tiếp đón nếu cần
    if (updated.trangThai) {
      let trangThaiTiepDon;
      if (updated.trangThai === "Đã Hoàn Thành") {
        trangThaiTiepDon = "Đã Khám";
      } else {
        trangThaiTiepDon = "Chờ Khám";
      }

      await TiepDon.findByIdAndUpdate(updated.tiepDon, {
        trangThai: trangThaiTiepDon,
      });
    }

     // 3. Trừ tồn kho dụng cụ đã sử dụng (mỗi dụng cụ -1)
    if (Array.isArray(req.body.dungCuSuDung)) {
      for (const dungCuId of req.body.dungCuSuDung) {
        await DungCuSuDung.findByIdAndUpdate(dungCuId, {
          $inc: { tonKho: -1 },
        });
      }
    }

    res.json({
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Lỗi updatePhieuKham:", error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};


// Xóa phiếu khám
exports.deletePhieuKham = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PhieuKham.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getPhieuKhamById = async (req, res) => {
  try {
    const id = req.params.id;
    const phieu = await PhieuKham.findById(id).populate({
      path: "tiepDon",
      populate: [{ path: "dichVu" }, { path: "bacSi" }],
    });
    if (!phieu) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }
    res.json({ data: phieu });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getPhieuKhamByTiepDon = async (req, res) => {
  try {
    const tiepDonId = req.params.tiepDonId;
    const list = await PhieuKham.find({ tiepDon: tiepDonId })
    .populate({
      path: "tiepDon",
      populate: [{ path: "dichVu" }, { path: "bacSi" }],
    })
    .sort({ createdAt: 1 });
    res.json({ data: list });
  } catch (error) {
    console.error("Lỗi getPhieuKhamByTiepDon:", error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};


exports.uploadFilePhieuKham = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: "Không có file" });
    }
    const updated = await PhieuKham.findByIdAndUpdate(
      id,
      { fileKetQua: req.file.filename },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }
    res.json({ message: "Tải file thành công", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.capNhatTrangThaiTT = async (req, res) => {
  try {
    const { id } = req.params;

    // Cập nhật trạng thái trong PhieuKham
    const updatedPhieu = await PhieuKham.findByIdAndUpdate(
      id,
      {
        trangThai: "Đã Hoàn Thành",
        trangThaiThanhToan: "Đã thanh toán",
      },
      { new: true }
    );

    if (!updatedPhieu) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }

    // Cập nhật trạng thái trong TiepDon nếu tồn tại
    if (updatedPhieu.tiepDon) {
      await TiepDon.findByIdAndUpdate(updatedPhieu.tiepDon, {
        trangThai: "Đã Khám",
      });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      data: updatedPhieu,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật trạng thái",
      error: error.message,
    });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Bệnh nhân mới trong tháng
    const benhNhan = await TiepDon.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Cuộc hẹn mới trong tháng (có thoiGianHen)
    const cuocHen = await TiepDon.countDocuments({
      thoiGianHen: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Ca điều trị (phiếu khám hoàn thành trong tháng)
    const caDieuTri = await PhieuKham.countDocuments({
      trangThai: "\u0110\u00e3 Ho\u00e0n Th\u00e0nh",
      updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Doanh thu (tổng thanhToan trong tháng)
    const list = await PhieuKham.find({
      trangThaiThanhToan: "\u0110\u00e3 thanh to\u00e1n",
      updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const doanhThuRaw = list.reduce((sum, item) => sum + (item.thanhToan || 0), 0);
    const doanhThu = doanhThuRaw.toLocaleString("vi-VN") + " VND";

    res.json({ benhNhan, cuocHen, caDieuTri, doanhThu });
  } catch (error) {
    console.error("Loi getDashboardStats:", error);
    res.status(500).json({ message: "Loi server" });
  }
};
