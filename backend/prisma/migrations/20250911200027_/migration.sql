/*
  Warnings:

  - Added the required column `principal` to the `AF` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AF" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Contrato_id" INTEGER NOT NULL,
    "principal" BOOLEAN NOT NULL,
    "numero" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "descricao" TEXT,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "AF_Contrato_id_fkey" FOREIGN KEY ("Contrato_id") REFERENCES "Contrato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AF" ("Contrato_id", "data_fim", "data_inicio", "descricao", "fornecedor", "id", "numero", "status") SELECT "Contrato_id", "data_fim", "data_inicio", "descricao", "fornecedor", "id", "numero", "status" FROM "AF";
DROP TABLE "AF";
ALTER TABLE "new_AF" RENAME TO "AF";
CREATE UNIQUE INDEX "AF_numero_key" ON "AF"("numero");
CREATE INDEX "AF_Contrato_id_idx" ON "AF"("Contrato_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
