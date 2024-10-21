const express = require("express");
const router = express.Router();
const {
	Add,
	GetAll,
	Update,
	Delete,
	GetByMatricule,
} = require("../Controller/Eleve.controller");

// Définir les routes
router.get("/", GetAll);
router.post("/Add", Add);
router.put("/Update/:MATRICULE", Update);
router.delete("/Delete/:MATRICULE", Delete);
router.get("/:MATRICULE", GetByMatricule);

// Exporter le routeur
module.exports = router;
