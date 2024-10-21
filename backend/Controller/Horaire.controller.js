const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");

exports.GetAll = async (req, res) => {
	try {
		const Horaires = await prisma.hORAIRE.findMany({
			include: {
				UE: true,
				PROF: true,
				SALLE: true,
				NIVEAU: true,
			},
		});
		res.status(200).json({ Horaires });
	} catch (error) {
		res.status(500).json({
			error: "Erreur lors de la récupération des horaires: " + error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
};

exports.GetOne = async (req, res) => {
	const { ABR_UE, ABR_PROF, DESIGNATION_SALLE, DESIGNATION_NIVEAU } =
		req.params;
	try {
		const Horaire = await prisma.hORAIRE.findUnique({
			where: {
				ABR_UE_ABR_PROF_DESIGNATION_SALLE_DESIGNATION_NIVEAU: {
					ABR_UE,
					ABR_PROF,
					DESIGNATION_SALLE,
					DESIGNATION_NIVEAU,
				},
			},
		});
		if (Horaire) {
			res.status(200).json({ Horaire });
		} else {
			res.status(404).json({ error: "Horaire non trouvé" });
		}
	} catch (error) {
		res.status(500).json({
			error: "Erreur lors de la récupération de l'horaire: " + error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
};

exports.Add = async (req, res) => {
	const {
		ABR_UE,
		ABR_PROF,
		DESIGNATION_SALLE,
		DESIGNATION_NIVEAU,
		DATE_HORAIRE,
		HEURE_DEBUT,
		HEURE_FIN,
		IS_FAIT,
	} = req.body;
	console.log(DATE_HORAIRE);
	console.log(moment.utc(DATE_HORAIRE, "MM-DD-YYYY"));
	try {
		const newHoraire = await prisma.hORAIRE.create({
			data: {
				ABR_UE,
				ABR_PROF,
				DESIGNATION_SALLE,
				DESIGNATION_NIVEAU,
				DATE_HORAIRE: moment.utc(DATE_HORAIRE, "MM-DD-YYYY"),
				HEURE_DEBUT: moment.utc(HEURE_DEBUT, "HH:mm:ss"),
				HEURE_FIN: moment.utc(HEURE_FIN, "HH:mm:ss"),
				IS_FAIT: Boolean(IS_FAIT),
			},
		});
		res.status(201).json("Ajout reussi");
	} catch (error) {
		res.status(500).json({
			error: "Erreur lors de la création de l'horaire: " + error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
};

exports.Update = async (req, res) => {
	const { ABR_UE, ABR_PROF, DESIGNATION_SALLE, DESIGNATION_NIVEAU } =
		req.params;
	const { DATE_HORAIRE, HEURE_DEBUT, HEURE_FIN, IS_FAIT } = req.body;
	try {
		const updatedHoraire = await prisma.hORAIRE.update({
			where: {
				ABR_UE_ABR_PROF_DESIGNATION_SALLE_DESIGNATION_NIVEAU: {
					ABR_UE,
					ABR_PROF,
					DESIGNATION_SALLE,
					DESIGNATION_NIVEAU,
				},
			},
			data: {
				DATE_HORAIRE,
				HEURE_DEBUT,
				HEURE_FIN,
				IS_FAIT,
			},
		});
		res.status(200).json(updatedHoraire);
	} catch (error) {
		res.status(500).json({
			error: "Erreur lors de la mise à jour de l'horaire: " + error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
};

exports.Delete = async (req, res) => {
	const { ABR_UE, ABR_PROF, DESIGNATION_SALLE, DESIGNATION_NIVEAU } =
		req.params;
	try {
		await prisma.hORAIRE.delete({
			where: {
				ABR_UE_ABR_PROF_DESIGNATION_SALLE_DESIGNATION_NIVEAU: {
					ABR_UE,
					ABR_PROF,
					DESIGNATION_SALLE,
					DESIGNATION_NIVEAU,
				},
			},
		});
		res.status(200).json("Horaire supprimé avec succès");
	} catch (error) {
		res.status(500).json({
			error: "Erreur lors de la suppression de l'horaire: " + error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
};
