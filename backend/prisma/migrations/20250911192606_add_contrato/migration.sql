/*
  Warnings:

  - Added the required column `Contrato_id` to the `AF` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Contrato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AF" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Contrato_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "descricao" TEXT,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "AF_Contrato_id_fkey" FOREIGN KEY ("Contrato_id") REFERENCES "Contrato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AF" ("data_fim", "data_inicio", "descricao", "fornecedor", "id", "numero", "status") SELECT "data_fim", "data_inicio", "descricao", "fornecedor", "id", "numero", "status" FROM "AF";
DROP TABLE "AF";
ALTER TABLE "new_AF" RENAME TO "AF";
CREATE UNIQUE INDEX "AF_numero_key" ON "AF"("numero");
CREATE INDEX "AF_Contrato_id_idx" ON "AF"("Contrato_id");
CREATE TABLE "new_Valor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Item_id" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    CONSTRAINT "Valor_Item_id_fkey" FOREIGN KEY ("Item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Valor" ("Item_id", "data_fim", "data_inicio", "id", "valor") SELECT "Item_id", "data_fim", "data_inicio", "id", "valor" FROM "Valor";
DROP TABLE "Valor";
ALTER TABLE "new_Valor" RENAME TO "Valor";
CREATE INDEX "Valor_Item_id_idx" ON "Valor"("Item_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_numero_key" ON "Contrato"("numero");
