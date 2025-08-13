const express = require("express");
const { getAllTiepDon, getTiepDonById, createTiepDon, deleteTiepDon, updateTiepDon } = require("../controllers/TiepDon/tiepDonController");
const TiepDon = require("../model/TiepDon");
const router = express.Router();

router.get("/get-tiep-don", getAllTiepDon);
router.get("/get-tiep-don-by-id/:id", getTiepDonById);
router.post("/create-tiep-don", createTiepDon);
router.put("/update-tiep-don/:id", updateTiepDon);
router.delete("/delete-tiep-don/:id", deleteTiepDon);


router.get("/check-busy1", async (req, res) => {
  try {
    const { bacSiId, startTime } = req.query;

    if (!bacSiId || !startTime) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }

    const caDurationMinutes = 60;

    const newCaStart = new Date(startTime);
    const newCaEnd = new Date(newCaStart.getTime() + caDurationMinutes * 60 * 1000);

    // Lấy tất cả lịch hẹn của bác sĩ trong cùng ngày
    const startOfDay = new Date(newCaStart);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(newCaStart);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const appointments = await TiepDon.find({
      bacSi: bacSiId,
      thoiGianHen: { $gte: startOfDay, $lte: endOfDay }
    });

    // Đếm số ca trùng
    let overlappingCount = 0;

    appointments.forEach((a) => {
      const oldStart = new Date(a.thoiGianHen);
      const oldEnd = new Date(oldStart.getTime() + caDurationMinutes * 60 * 1000);

      if (newCaStart < oldEnd && newCaEnd > oldStart) {
        overlappingCount++;
      }
    });

    let status = "Vắng";
    if (overlappingCount === 1) status = "Bình thường";
    else if (overlappingCount === 2) status = "Đông";
    else if (overlappingCount >= 3) status = "Rất đông";

    res.json({
      count: overlappingCount,
      status
    });
  } catch (err) {
    console.error("Lỗi check busy:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});



router.get("/check-busy", async (req, res) => {
  try {
    const { bacSiId, startTime } = req.query;

    if (!bacSiId || !startTime) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }

    const baseDate = new Date(startTime);

    // Lấy YYYY-MM-DD
    const dateString = baseDate.toISOString().slice(0, 10); // "2025-05-05"

    // Tạo mốc UTC ngày bắt đầu/kết thúc
    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

    const count = await TiepDon.countDocuments({
      bacSi: bacSiId,
      thoiGianHen: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      trangThai:{$in: ["Chờ Khám", "dang_kham", "cho_kham"]}
    });

    let status = "Vắng";
    if (count >= 1 && count <= 2) status = "Bình thường";
    else if (count >= 3 && count <= 5) status = "Đông";
    else if (count >= 6) status = "Rất đông";


    res.json({ count, status });
  } catch (err) {
    console.error("Lỗi check busy:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});




module.exports = router;
