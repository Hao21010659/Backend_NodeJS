const express = require("express");
const router = express.Router();
const {
  getAllDichVu,
  getDichVuById,
  createDichVu,
  updateDichVu,
  deleteDichVu
} = require("../controllers/DichVu/dichVuController");

router.get("/get-all-dich-vu", getAllDichVu);
router.get("/get-all-dich-vu-by-id/:id", getDichVuById);
router.post("/create-dich-vu", createDichVu);
router.put("/update-dich-vu/:id", updateDichVu);
router.delete("/delete-dich-vu/:id", deleteDichVu);

module.exports = router;
