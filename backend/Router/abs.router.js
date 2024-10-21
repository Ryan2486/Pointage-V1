const express = require("express");
const router = express.Router();
const { GetStudentsByTimeRange } = require("../Controller/Abs.controller");

router.post("/presence", GetStudentsByTimeRange); // Nouvelle route pour récupérer les élèves par tranche horaire

// Exporter le routeur
module.exports = router;
