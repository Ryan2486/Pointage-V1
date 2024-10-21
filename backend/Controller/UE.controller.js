const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetAll = async (req, res) => {
	try {
		const ues = await prisma.uE.findMany();
		res.status(200).json({ ues });
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
	const { ABR_UE, DESIGNATION_UE } = req.body;
	try {
		await prisma.uE.create({
			data: {
				ABR_UE,
				DESIGNATION_UE,
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
	const { ABR_UE } = req.params;
	const { DESIGNATION_UE } = req.body;

	try {
		await prisma.uE.update({
			where: { ABR_UE },
			data: { DESIGNATION_UE },
		});
		res.status(200).json("Mise à jour réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Delete = async (req, res) => {
	const { ABR_UE } = req.params;

	try {
		await prisma.uE.delete({
			where: { ABR_UE },
		});
		res.status(200).json("Suppression réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};
