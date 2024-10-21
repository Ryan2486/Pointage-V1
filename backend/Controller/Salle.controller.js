const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetAll = async (req, res) => {
	try {
		const salles = await prisma.sALLE.findMany();
		res.status(200).json({ salles });
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Add = async (req, res) => {
	if (!req.body) {
		res.status(400).json("Requete invalide");
		return;
	}
	const { DESIGNATION_SALLE } = req.body;
	try {
		await prisma.sALLE.create({
			data: {
				DESIGNATION_SALLE,
			},
		});
		res.status(200).json("Insertion Reussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Update = async (req, res) => {
	const { DESIGNATION_SALLE } = req.params;
	const { newDesignation } = req.body;

	if (!newDesignation) {
		res.status(400).json("Requete invalide");
		return;
	}

	try {
		await prisma.sALLE.update({
			where: { DESIGNATION_SALLE },
			data: { DESIGNATION_SALLE: newDesignation },
		});
		res.status(200).json("Mise à jour réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Delete = async (req, res) => {
	const { DESIGNATION_SALLE } = req.params;

	try {
		await prisma.sALLE.delete({
			where: { DESIGNATION_SALLE },
		});
		res.status(200).json("Suppression réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};
