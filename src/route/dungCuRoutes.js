const express = require("express");
const { getAll, getById, create, update, remove } = require("../controllers/DungCuSuDung/dungCuSuDungController");
const router = express.Router();

router.get("/get-dungcusudung", getAll);
router.get("/get-dungcusudung-byid/:id", getById);
router.post("/create-dungcusudung", create);
router.put("/update-dungcusudung/:id", update);
router.delete("/delete-dungcusudung/:id", remove);

module.exports = router;
