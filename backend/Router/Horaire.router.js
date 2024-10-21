const express = require("express");
const router = express.Router();
const {
	Add,
	GetAll,
	Update,
	Delete,
	GetOne,
} = require("../Controller/Horaire.controller");

router.get("/", GetAll);
router.get("/:ABR_UE/:ABR_PROF/:DESIGNATION_SALLE/:DESIGNATION_NIVEAU", GetOne);
router.post("/Add", Add);
router.put("/:ABR_UE/:ABR_PROF/:DESIGNATION_SALLE/:DESIGNATION_NIVEAU", Update);
router.delete(
	"/Delete/:ABR_UE/:ABR_PROF/:DESIGNATION_SALLE/:DESIGNATION_NIVEAU",
	Delete
);

module.exports = router;
