const express = require("express");
const router = express.Router();
const {
	Add,
	GetAll,
	Update,
	Delete,
} = require("../Controller/Niveau.controller");

// Définir les routes
router.get("/", GetAll);
router.post("/Add", Add);
router.put("/Update/:DESIGNATION_NIVEAU", Update);
router.delete("/Delete/:DESIGNATION_NIVEAU", Delete);

// Exporter le routeur
module.exports = router;
