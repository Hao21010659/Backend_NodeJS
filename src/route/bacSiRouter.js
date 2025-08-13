const express = require("express");
const { getAllBacSis, getBacSiById, createBacSi, updateBacSi, deleteBacSi } = require("../controllers/BacSi/doctorController");
const router = express.Router();

router.get("/get-all-bac-si", getAllBacSis);
router.get("/get-all-bac-si-by-id/:id", getBacSiById);
router.post("/create-bac-si", createBacSi);
router.put("/update-bac-si/:id", updateBacSi);
router.delete("/delete-bac-si/:id", deleteBacSi);

module.exports = router;
