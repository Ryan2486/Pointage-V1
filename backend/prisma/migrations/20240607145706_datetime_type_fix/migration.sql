/*
  Warnings:

  - Made the column `DATE_HORAIRE` on table `HORAIRE` required. This step will fail if there are existing NULL values in that column.
  - Made the column `HEURE_DEBUT` on table `HORAIRE` required. This step will fail if there are existing NULL values in that column.
  - Made the column `HEURE_FIN` on table `HORAIRE` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[HORAIRE] ALTER COLUMN [DATE_HORAIRE] DATE NOT NULL;
ALTER TABLE [dbo].[HORAIRE] ALTER COLUMN [HEURE_DEBUT] TIME NOT NULL;
ALTER TABLE [dbo].[HORAIRE] ALTER COLUMN [HEURE_FIN] TIME NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
