const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetAll = async (req, res) => {
	try {
		const profs = await prisma.pROF.findMany();
		res.status(200).json({ profs });
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
	const { ABR_PROF, NOM_PROF } = req.body;
	try {
		await prisma.pROF.create({
			data: {
				ABR_PROF,
				NOM_PROF,
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
	const { ABR_PROF } = req.params;
	const { NOM_PROF } = req.body;

	try {
		await prisma.pROF.update({
			where: { ABR_PROF },
			data: { NOM_PROF },
		});
		res.status(200).json("Mise à jour réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Delete = async (req, res) => {
	const { ABR_PROF } = req.params;

	try {
		await prisma.pROF.delete({
			where: { ABR_PROF },
		});
		res.status(200).json("Suppression réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};
