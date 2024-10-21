const Niveau = require("./Niveau.router");
const Eleve = require("./Eleve.router");
const Salle = require("./Salle.router");
const UE = require("./UE.router");
const Prof = require("./Prof.router");
const Horaire = require("./Horaire.router");
const presence = require("./abs.router");
const express = require("express");
const router = express.Router();

router.use("/Niveau/", Niveau);
router.use("/Eleve/", Eleve);
router.use("/Salle", Salle);
router.use("/UE/", UE);
router.use("/Prof/", Prof);
router.use("/Horaire/", Horaire);
router.use("/pointer/", presence);

module.exports = router;
