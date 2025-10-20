/*
  Warnings:

  - You are about to drop the column `status` on the `Instalacao` table. All the data in the column will be lost.
  - You are about to drop the column `data_alteracao` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instalacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "data_desinstalacao" DATETIME,
    "quantidade" INTEGER NOT NULL,
    CONSTRAINT "Instalacao_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Instalacao_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Instalacao" ("banda_instalada", "data_desinstalacao", "data_instalacao", "id", "itemId", "localId", "quantidade") SELECT "banda_instalada", "data_desinstalacao", "data_instalacao", "id", "itemId", "localId", "quantidade" FROM "Instalacao";
DROP TABLE "Instalacao";
ALTER TABLE "new_Instalacao" RENAME TO "Instalacao";
CREATE INDEX "Instalacao_itemId_idx" ON "Instalacao"("itemId");
CREATE INDEX "Instalacao_localId_idx" ON "Instalacao"("localId");
CREATE UNIQUE INDEX "Instalacao_itemId_localId_key" ON "Instalacao"("itemId", "localId");
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "principalId" INTEGER NOT NULL,
    "descricao" TEXT,
    "banda_maxima" INTEGER NOT NULL,
    "quantidade_maxima" INTEGER NOT NULL,
    CONSTRAINT "Item_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("banda_maxima", "descricao", "id", "principalId", "quantidade_maxima") SELECT "banda_maxima", "descricao", "id", "principalId", "quantidade_maxima" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE INDEX "Item_principalId_idx" ON "Item"("principalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
