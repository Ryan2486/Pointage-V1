const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetAll = async (req, res) => {
	try {
		const eleves = await prisma.eLEVE.findMany();
		res.status(200).json({ eleves });
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
	const { MATRICULE, DESIGNATION_NIVEAU, NOM } = req.body;

	try {
		await prisma.eLEVE.create({
			data: {
				MATRICULE,
				DESIGNATION_NIVEAU,
				NOM,
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
	const { MATRICULE } = req.params;
	const { DESIGNATION_NIVEAU, NOM } = req.body;
	try {
		await prisma.eLEVE.update({
			where: { MATRICULE },
			data: { DESIGNATION_NIVEAU, NOM },
		});
		res.status(200).json("Mise à jour réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};

exports.Delete = async (req, res) => {
	const { MATRICULE } = req.params;

	try {
		await prisma.eLEVE.delete({
			where: { MATRICULE },
		});
		res.status(200).json("Suppression réussie");
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};
exports.GetByMatricule = async (req, res) => {
	const { MATRICULE } = req.params;
	try {
		const eleve = await prisma.eLEVE.findUnique({
			where: { MATRICULE },
		});
		if (eleve) {
			res.status(200).json({ eleve });
		} else {
			res.status(404).json("Élève non trouvé");
		}
	} catch (error) {
		res.status(401).json("Erreur N°: " + error.code);
	} finally {
		await prisma.$disconnect();
	}
};
