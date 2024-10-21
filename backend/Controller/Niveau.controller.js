const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetAll = async (req, res) => {
	try {
		const niveaux = await prisma.nIVEAU.findMany();
		res.status(200).json({ niveaux });
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
	const { DESIGNATION_NIVEAU } = req.body;

	try {
		await prisma.nIVEAU.create({
			data: {
				DESIGNATION_NIVEAU,
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
	const { DESIGNATION_NIVEAU } = req.params;
	const { newDesignation } = req.body;
	if (!newDesignation) {
		res.status(400).json("Requete invalide");
		return;
	}
	console.log(DESIGNATION_NIVEAU, newDesignation);

	try {
		await prisma.nIVEAU.update({
			where: { DESIGNATION_NIVEAU },
			data: { DESIGNATION_NIVEAU: newDesignation },
		});
		res.status(200).json("Mise à jour réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Delete = async (req, res) => {
	const { DESIGNATION_NIVEAU } = req.params;

	try {
		await prisma.nIVEAU.delete({
			where: { DESIGNATION_NIVEAU },
		});
		res.status(200).json("Suppression réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};
