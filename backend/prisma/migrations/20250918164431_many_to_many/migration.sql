/*
  Warnings:

  - You are about to drop the column `AF_id` on the `Item` table. All the data in the column will be lost.
  - Added the required column `principal_id` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AF_id` to the `Valor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_AFToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AFToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "AF" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AFToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "principal_id" INTEGER NOT NULL,
    "Local_id" INTEGER NOT NULL,
    "descricao" TEXT,
    "banda_maxima" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "Item_Local_id_fkey" FOREIGN KEY ("Local_id") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_principal_id_fkey" FOREIGN KEY ("principal_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("Local_id", "banda_instalada", "banda_maxima", "data_instalacao", "descricao", "id", "quantidade", "status") SELECT "Local_id", "banda_instalada", "banda_maxima", "data_instalacao", "descricao", "id", "quantidade", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE INDEX "Item_principal_id_idx" ON "Item"("principal_id");
CREATE INDEX "Item_Local_id_idx" ON "Item"("Local_id");
CREATE TABLE "new_Valor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Item_id" INTEGER NOT NULL,
    "AF_id" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    CONSTRAINT "Valor_Item_id_fkey" FOREIGN KEY ("Item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Valor_AF_id_fkey" FOREIGN KEY ("AF_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Valor" ("Item_id", "data_fim", "data_inicio", "id", "valor") SELECT "Item_id", "data_fim", "data_inicio", "id", "valor" FROM "Valor";
DROP TABLE "Valor";
ALTER TABLE "new_Valor" RENAME TO "Valor";
CREATE INDEX "Valor_Item_id_idx" ON "Valor"("Item_id");
CREATE INDEX "Valor_AF_id_idx" ON "Valor"("AF_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_AFToItem_AB_unique" ON "_AFToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_AFToItem_B_index" ON "_AFToItem"("B");
