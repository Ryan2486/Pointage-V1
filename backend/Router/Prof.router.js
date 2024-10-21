const express = require("express");
const router = express.Router();
const {
	Add,
	GetAll,
	Update,
	Delete,
} = require("../Controller/Prof.controller");

// Définir les routes
router.get("/", GetAll);
router.post("/Add", Add);
router.put("/Update/:ABR_PROF", Update);
router.delete("/Delete/:ABR_PROF", Delete);

// Exporter le routeur
module.exports = router;
