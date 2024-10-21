const express = require("express");
const router = express.Router();
const {
	Add,
	GetAll,
	Update,
	Delete,
} = require("../Controller/Salle.controller");

// Définir les routes
router.get("/", GetAll);
router.post("/Add", Add);
router.put("/Update/:DESIGNATION_SALLE", Update);
router.delete("/Delete/:DESIGNATION_SALLE", Delete);

// Exporter le routeur
module.exports = router;
