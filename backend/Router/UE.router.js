const express = require("express");
const router = express.Router();
const { Add, GetAll, Update, Delete } = require("../Controller/UE.controller");

// Définir les routes
router.get("/", GetAll);
router.post("/Add", Add);
router.put("/Update/:ABR_UE", Update);
router.delete("/Delete/:ABR_UE", Delete);

// Exporter le routeur
module.exports = router;
