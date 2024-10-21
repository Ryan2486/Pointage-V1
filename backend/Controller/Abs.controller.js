const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");

const GetStudentsByTimeRange = async (req, res) => {
	const { date, heureDebut, heureFin } = req.body;
	console.log(req.body);
	try {
		const horaires = await prisma.hORAIRE.findMany({
			where: {
				DATE_HORAIRE: moment.utc(date, "YYYY-MM-DD"),
			},
			include: {
				NIVEAU: {
					include: {
						ELEVE: true,
					},
				},
			},
		});
		console.log(horaires);
		let students = [];

		const debutPlage = moment.utc(heureDebut, "HH:mm");
		const finPlage = moment.utc(heureFin, "HH:mm");

		// Filtrage des plages horaires
		horaires.forEach((horaire) => {
			const debutHoraire = moment.utc(horaire.HEURE_DEBUT, "HH:mm:ss");
			const finHoraire = moment.utc(horaire.HEURE_FIN, "HH:mm:ss");
			// Extraire seulement les heures et les minutes des horaires et des plages horaires
			const heureDebutHoraire = debutHoraire.hours();
			const minuteDebutHoraire = debutHoraire.minutes();
			const heureFinHoraire = finHoraire.hours();
			const minuteFinHoraire = finHoraire.minutes();
			const heureDebutPlage = debutPlage.hours();
			const minuteDebutPlage = debutPlage.minutes();
			const heureFinPlage = finPlage.hours();
			const minuteFinPlage = finPlage.minutes();

			// Vérifier si les plages horaires se chevauchent en termes d'heures et de minutes
			if (
				(heureDebutPlage > heureDebutHoraire ||
					(heureDebutPlage === heureDebutHoraire &&
						minuteDebutPlage >= minuteDebutHoraire)) &&
				(heureDebutPlage < heureFinHoraire ||
					(heureDebutPlage === heureFinHoraire &&
						minuteDebutPlage < minuteFinHoraire)) &&
				(heureFinPlage > heureDebutHoraire ||
					(heureFinPlage === heureDebutHoraire &&
						minuteFinPlage > minuteDebutHoraire)) &&
				(heureFinPlage < heureFinHoraire ||
					(heureFinPlage === heureFinHoraire &&
						minuteFinPlage <= minuteFinHoraire))
			) {
				students = students.concat(horaire.NIVEAU.ELEVE);
			}
		});
		const pointeurs = await GetPointeur(date, heureDebut, heureFin);
		// Créer un ensemble de matricules présents
		const matriculesPresents = new Set(
			pointeurs.map((pointeur) => pointeur.matricule)
		);

		// Marquer les étudiants comme présents ou absents
		const elevesAvecPresence = students.map((student) => {
			const pointeur = pointeurs.find((p) => p.matricule === student.MATRICULE);
			return {
				...student,
				Etat: pointeur ? pointeur.etat : "Absent",
			};
		});

		res.status(200).json({ Eleves: elevesAvecPresence });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Erreur lors de la récupération des élèves pour la tranche horaire",
			error,
		});
	}
};

const GetPointeur = async (date, heureDebut, heureFin) => {
	console.log(date, heureDebut, heureFin);

	try {
		// Récupérer tous les pointeurs pour la date spécifiée
		const pointeurs = await prisma.pointeur.findMany({
			where: {
				date: moment.utc(date, "YYYY-MM-DD"),
			},
		});
		// Convertir les heures de début et de fin en moments
		const debutPlage = moment.utc(heureDebut, "HH:mm").subtract(30, "minutes");
		const finPlage = moment.utc(heureFin, "HH:mm").add(30, "minutes");

		// Extraire seulement les heures et les minutes des plages horaires
		const heureDebutPlage = debutPlage.hours();
		const minuteDebutPlage = debutPlage.minutes();
		const heureFinPlage = finPlage.hours();
		const minuteFinPlage = finPlage.minutes();

		// Filtrer les pointeurs en fonction de la plage horaire spécifiée
		const filteredPointeurs = pointeurs.filter((pointeur) => {
			const pointeurHeure = moment.utc(pointeur.heure);

			// Extraire seulement les heures et les minutes des pointeurs
			const heurePointeur = pointeurHeure.hours();
			const minutePointeur = pointeurHeure.minutes();

			// Vérifier si les heures et les minutes des pointeurs sont dans la plage horaire
			return (
				(heureDebutPlage < heurePointeur ||
					(heureDebutPlage === heurePointeur &&
						minuteDebutPlage <= minutePointeur)) &&
				(heureFinPlage > heurePointeur ||
					(heureFinPlage === heurePointeur && minuteFinPlage >= minutePointeur))
			);
		});

		// Grouper les pointeurs par matricule
		const pointeursParMatricule = filteredPointeurs.reduce((acc, pointeur) => {
			if (!acc[pointeur.matricule]) {
				acc[pointeur.matricule] = [];
			}
			acc[pointeur.matricule].push(pointeur);
			return acc;
		}, {});
		console.log(pointeursParMatricule);

		// Récupérer les matricules ayant une "entree" et une "sortie" dans le délai spécifié
		const matriculesValides = [];
		for (const [matricule, pointeurs] of Object.entries(
			pointeursParMatricule
		)) {
			const entrees = pointeurs.filter(
				(p) => p.direction.toLowerCase() === "entre"
			);
			const sorties = pointeurs.filter(
				(p) => p.direction.toLowerCase() === "sorti"
			);
			console.log(matricule);
			const entreeValide = entrees.some(
				(entree) =>
					differenceInMinutes(
						moment.utc(debutPlage),
						moment.utc(entree.heure)
					) <= 30 &&
					differenceInMinutes(
						moment.utc(debutPlage),
						moment.utc(entree.heure)
					) >= 0
			);
			const retardValide = entrees.some(
				(entree) =>
					differenceInMinutes(
						moment.utc(debutPlage),
						moment.utc(entree.heure)
					) > 30 &&
					differenceInMinutes(
						moment.utc(debutPlage),
						moment.utc(entree.heure)
					) <= 45
			);

			const sortieValide = sorties.some(
				(sortie) =>
					differenceInMinutes(moment.utc(sortie.heure), moment.utc(finPlage)) <=
						45 &&
					differenceInMinutes(moment.utc(sortie.heure), moment.utc(finPlage)) >=
						0
			);

			if (retardValide && sortieValide) {
				matriculesValides.push({
					matricule,
					etat: "En Retard",
				});
			} else if (entreeValide && sortieValide) {
				matriculesValides.push({
					matricule,
					etat: "Present",
				});
			}
		}
		console.log(matriculesValides);
		return matriculesValides;
	} catch (error) {
		throw new Error(error.message);
	}
};
function differenceInMinutes(moment1, moment2) {
	// Extraire les heures et les minutes des moments
	const hour1 = moment1.hours();
	const minute1 = moment1.minutes();
	const hour2 = moment2.hours();
	const minute2 = moment2.minutes();

	// Convertir les heures et les minutes en minutes
	const time1InMinutes = hour1 * 60 + minute1;
	const time2InMinutes = hour2 * 60 + minute2;

	// Calculer la différence en minutes
	const differenceInMinutes = Math.abs(time1InMinutes - time2InMinutes);
	console.log(differenceInMinutes);
	return differenceInMinutes;
}

module.exports = {
	GetStudentsByTimeRange,
};
