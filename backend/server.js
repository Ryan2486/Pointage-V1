const express = require("express");
const app = express();
const sql = require("mssql");
const cors = require("cors");
const xlsx = require("xlsx");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");
const MainRoute = require("./Router/Main.router");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const config = {
	user: "ENI",
	password: "azerty",
	server: "localhost",
	database: "pointage",
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
	port: 1433,
};

sql.connect(config, (err) => {
	if (err) {
		console.log("Erreur de connexion à SQL Server : ", err);
	} else {
		console.log("Connexion à SQL Server réussie !");
	}
});

app.use("/", MainRoute);
app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/etudiants", async (req, res) => {
	try {
		const result = await sql.query`SELECT * FROM etudiant`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.post("/create", async (req, res) => {
	const matricule = req.body.matricule;
	const nom = req.body.nom;
	const classe = req.body.classe;

	try {
		const result =
			await sql.query`INSERT INTO etudiant (matricule, nom, classe) VALUES (${matricule}, ${nom}, ${classe})`;
		res.send("Etudiant enregistré avec succès !");
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.get("/etudiandetails/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const result = await sql.query`SELECT * FROM etudiant WHERE id = ${id}`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.delete("/etudiants/:id", async (req, res) => {
	const etudiantId = req.params.id;
	try {
		const result =
			await sql.query`DELETE FROM etudiant WHERE id = ${etudiantId}`;
		res.json(result);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.put("/etudiants/:id", async (req, res) => {
	const etudiantId = req.params.id;
	const matricule = req.body.matricule;
	const nom = req.body.nom;
	const classe = req.body.classe;

	console.log("Updating etudiant with ID:", etudiantId);
	console.log("Updated data:", matricule, nom, classe);

	try {
		const result =
			await sql.query`UPDATE etudiant SET matricule = ${matricule}, nom = ${nom}, classe = ${classe} WHERE id = ${etudiantId}`;
		console.log("Update successful");
		res.json(result);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.post("/upload", async (req, res) => {
	try {
		if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).send("No files were uploaded.");
		}

		const excelFile = req.files.excelFile;
		const workbook = xlsx.read(excelFile.data, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

		for (const row of sheetData) {
			const MATRICULE = row["*Person ID"]; // Adjusted column name
			const NOM = row["*Person Name"]; // Adjusted column name
			const NIVEAU = row["*Organization"]; // Adjusted column name

			await sql.query`INSERT INTO ELEVE (MATRICULE, NOM, DESIGNATION_NIVEAU) VALUES (${MATRICULE}, ${NOM}, ${NIVEAU})`;
		}

		res.send("Data from Excel file inserted successfully.");
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

// ...

app.get("/pointeurs", async (req, res) => {
	try {
		const result = await sql.query`SELECT * FROM pointeur`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.get("/matieres", async (req, res) => {
	try {
		const result = await sql.query`SELECT * FROM matiere`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.post("/matieres", async (req, res) => {
	let abreviation = req.body.abreviation;
	const nom_matiere = req.body.nom_matiere;
	let classe = req.body.classe;

	try {
		// Insert matière into the matiere table
		const resultMatiere =
			await sql.query`INSERT INTO matiere (abreviation, nom_matiere, classe) VALUES (${abreviation}, ${nom_matiere}, ${classe})`;

		abreviation = abreviation.replace(/\s/g, "");
		classe = classe.replace(/\s/g, "");

		// Create a table for the matière
		const createTableQuery = `
      SELECT id as ID , matricule as Matricule , nom as Nom
      INTO ${abreviation + classe}
      FROM etudiant
      WHERE classe = '${classe}'
      `;

		await sql.query(createTableQuery);

		res.send("Matière ajoutée avec succès !");
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.get("/matieres/:id", async (req, res) => {
	const id_matiere = req.params.id;
	try {
		const result =
			await sql.query`SELECT * FROM matiere WHERE id_matiere = ${id_matiere}`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.delete("/matieres/:id", async (req, res) => {
	const id_matiere = req.params.id;
	try {
		const result =
			await sql.query`DELETE FROM matiere WHERE id_matiere = ${id_matiere}`;
		res.json(result);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.get("/edt", async (req, res) => {
	try {
		const result = await sql.query`SELECT * FROM edt`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.post("/edt", async (req, res) => {
	let { matiere, heure_debut, heure_fin, date, classe } = req.body;

	const formatDate = (inputDate) => {
		const dateObj = new Date(inputDate);
		const year = dateObj.getFullYear();
		const month = String(dateObj.getMonth() + 1).padStart(2, "0");
		const day = String(dateObj.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// Assurez-vous que la date est au format yyyy-mm-dd
	const formattedDate = formatDate(date);

	try {
		// Insérer le cours dans la table edt
		const resultEdt = await sql.query`
      INSERT INTO edt (matiere, heure_debut, heure_fin, date, classe)
      VALUES (${matiere}, ${heure_debut}, ${heure_fin}, ${formattedDate}, ${classe})
    `;

		abreviation = abreviation.replace(/\s/g, "");
		classe = classe.replace(/\s/g, "");

		// Ajouter une colonne à la table avec le nom de la matière et la variable date
		const addColumnQuery = `
      ALTER TABLE ${matiere + classe}
      ADD [${formattedDate}] VARCHAR(10) DEFAULT 'absent';
    `;

		await sql.query(addColumnQuery);

		res.send("Cours ajouté avec succès !");
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.get("/edt/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const result = await sql.query`SELECT * FROM edt WHERE id = ${id}`;
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.delete("/edt/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const result = await sql.query`DELETE FROM edt WHERE id = ${id}`;
		res.json(result);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.put("/edt/:id", async (req, res) => {
	const id = req.params.id;
	const matiere = req.body.matiere;
	const heure_debut = req.body.heure_debut;
	const heure_fin = req.body.heure_fin;
	const date = req.body.date;
	const classe = req.body.classe;

	try {
		const result = await sql.query`
      UPDATE edt
      SET matiere = ${matiere}, heure_debut = ${heure_debut}, heure_fin = ${heure_fin}, date = ${date}, classe = ${classe}
      WHERE id = ${id}
    `;
		res.json(result);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.get("/absences/:matiere", async (req, res) => {
	const matiere = req.params.matiere;

	try {
		const query = `SELECT * FROM ${matiere}`;

		const result = await sql.query(query);

		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.json(err);
	}
});

app.post("/verifier", async (req, res) => {
	const { matiere, date, heureDebut, heureFin } = req.body;
	console.log("Date reçue :", date);
	console.log("Heure de début :", heureDebut);
	console.log("Heure de fin :", heureFin);
	try {
		const pool = await sql.connect("connectionString");
		const result = await pool
			.request()
			.input("matiere", sql.VarChar(50), matiere)
			.input("date", sql.Date, date).query(`
              UPDATE ${matiere}
              SET [${date}] = CASE
                  WHEN Pointeur.matricule IS NOT NULL AND CAST(Pointeur.heure AS TIME) BETWEEN DATEADD(MINUTE, -30, CAST('${heureDebut}' AS TIME)) 
                  AND DATEADD(MINUTE, -15, CAST('${heureFin}' AS TIME)) 
                  THEN 'present'
                  ELSE 'absent'
              END
              FROM ${matiere}
              LEFT JOIN Pointeur ON ${matiere}.matricule = Pointeur.matricule;
          `);
		res.send("Vérification des absences effectuée avec succès !");
	} catch (err) {
		console.error("Erreur lors de la vérification des absences :", err);
		res.status(500).send("Erreur lors de la vérification des absences");
	}
});

// cron.schedule("00 19 * * *", async () => {
// 	try {
// 		// Exécution de la requête pour vider la table
// 		await sql.query("DELETE FROM pointeur");
// 		console.log('La table "pointeur" a été vidée avec succès.');
// 	} catch (error) {
// 		console.error(
// 			'Erreur lors de la tentative de vidage de la table "pointeur" :',
// 			error
// 		);
// 	}
// });

app.listen(3001, () => {
	console.log("Yey, your server is running on port 3001");
});
