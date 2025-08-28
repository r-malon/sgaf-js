/*
  Warnings:

  - Added the required column `nome_normalized` to the `Local` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Local" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nome_normalized" TEXT NOT NULL
);
INSERT INTO "new_Local" ("id", "nome") SELECT "id", "nome" FROM "Local";
DROP TABLE "Local";
ALTER TABLE "new_Local" RENAME TO "Local";
CREATE UNIQUE INDEX "Local_nome_key" ON "Local"("nome");
CREATE UNIQUE INDEX "Local_nome_normalized_key" ON "Local"("nome_normalized");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Item_AF_id_idx" ON "Item"("AF_id");

-- CreateIndex
CREATE INDEX "Item_Local_id_idx" ON "Item"("Local_id");

-- CreateIndex
CREATE INDEX "Valor_Item_id_idx" ON "Valor"("Item_id");
