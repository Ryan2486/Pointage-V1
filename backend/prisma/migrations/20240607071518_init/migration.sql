BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ELEVE] (
    [MATRICULE] NVARCHAR(1000) NOT NULL,
    [DESIGNATION_NIVEAU] NVARCHAR(1000) NOT NULL,
    [NOM] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ELEVE_pkey] PRIMARY KEY CLUSTERED ([MATRICULE])
);

-- CreateTable
CREATE TABLE [dbo].[HORAIRE] (
    [ABR_UE] NVARCHAR(1000) NOT NULL,
    [ABR_PROF] NVARCHAR(1000) NOT NULL,
    [DESIGNATION_SALLE] NVARCHAR(1000) NOT NULL,
    [DESIGNATION_NIVEAU] NVARCHAR(1000) NOT NULL,
    [DATE_HORAIRE] DATETIME2,
    [HEURE_DEBUT] DATETIME2,
    [HEURE_FIN] DATETIME2,
    [IS_FAIT] BIT NOT NULL,
    CONSTRAINT [HORAIRE_pkey] PRIMARY KEY CLUSTERED ([ABR_UE],[ABR_PROF],[DESIGNATION_SALLE],[DESIGNATION_NIVEAU])
);

-- CreateTable
CREATE TABLE [dbo].[PROF] (
    [NOM_PROF] NVARCHAR(1000) NOT NULL,
    [ABR_PROF] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PROF_pkey] PRIMARY KEY CLUSTERED ([ABR_PROF])
);

-- CreateTable
CREATE TABLE [dbo].[UE] (
    [DESIGNATION_UE] NVARCHAR(1000) NOT NULL,
    [ABR_UE] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [UE_pkey] PRIMARY KEY CLUSTERED ([ABR_UE])
);

-- CreateTable
CREATE TABLE [dbo].[NIVEAU] (
    [DESIGNATION_NIVEAU] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [NIVEAU_pkey] PRIMARY KEY CLUSTERED ([DESIGNATION_NIVEAU])
);

-- CreateTable
CREATE TABLE [dbo].[SALLE] (
    [DESIGNATION_SALLE] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SALLE_pkey] PRIMARY KEY CLUSTERED ([DESIGNATION_SALLE])
);

-- CreateTable
CREATE TABLE [dbo].[pointeur] (
    [id] INT NOT NULL IDENTITY(1,1),
    [matricule] NVARCHAR(50) NOT NULL,
    [dateheure] DATETIME NOT NULL,
    [date] DATE NOT NULL,
    [heure] TIME NOT NULL,
    [direction] NVARCHAR(50) NOT NULL,
    [salle] NVARCHAR(50) NOT NULL,
    [SN] NVARCHAR(250) NOT NULL,
    [nom] NVARCHAR(250) NOT NULL,
    [carte] NVARCHAR(250) NOT NULL,
    CONSTRAINT [pointeur_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B613C3FCB7B] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ELEVE_DESIGNATION_NIVEAU_idx] ON [dbo].[ELEVE]([DESIGNATION_NIVEAU]);

-- AddForeignKey
ALTER TABLE [dbo].[ELEVE] ADD CONSTRAINT [ELEVE_DESIGNATION_NIVEAU_fkey] FOREIGN KEY ([DESIGNATION_NIVEAU]) REFERENCES [dbo].[NIVEAU]([DESIGNATION_NIVEAU]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HORAIRE] ADD CONSTRAINT [HORAIRE_ABR_UE_fkey] FOREIGN KEY ([ABR_UE]) REFERENCES [dbo].[UE]([ABR_UE]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HORAIRE] ADD CONSTRAINT [HORAIRE_ABR_PROF_fkey] FOREIGN KEY ([ABR_PROF]) REFERENCES [dbo].[PROF]([ABR_PROF]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HORAIRE] ADD CONSTRAINT [HORAIRE_DESIGNATION_SALLE_fkey] FOREIGN KEY ([DESIGNATION_SALLE]) REFERENCES [dbo].[SALLE]([DESIGNATION_SALLE]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HORAIRE] ADD CONSTRAINT [HORAIRE_DESIGNATION_NIVEAU_fkey] FOREIGN KEY ([DESIGNATION_NIVEAU]) REFERENCES [dbo].[NIVEAU]([DESIGNATION_NIVEAU]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
