/*
  Warnings:

  - You are about to drop the column `Local_id` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `banda_instalada` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `data_instalacao` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - Added the required column `quantidade_maxima` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ItemLocal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Item_id" INTEGER NOT NULL,
    "Local_id" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "ItemLocal_Item_id_fkey" FOREIGN KEY ("Item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemLocal_Local_id_fkey" FOREIGN KEY ("Local_id") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "principal_id" INTEGER NOT NULL,
    "descricao" TEXT,
    "banda_maxima" INTEGER NOT NULL,
    "quantidade_maxima" INTEGER NOT NULL,
    CONSTRAINT "Item_principal_id_fkey" FOREIGN KEY ("principal_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("banda_maxima", "descricao", "id", "principal_id") SELECT "banda_maxima", "descricao", "id", "principal_id" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE INDEX "Item_principal_id_idx" ON "Item"("principal_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ItemLocal_Item_id_idx" ON "ItemLocal"("Item_id");

-- CreateIndex
CREATE INDEX "ItemLocal_Local_id_idx" ON "ItemLocal"("Local_id");

-- CreateIndex
CREATE UNIQUE INDEX "ItemLocal_Item_id_Local_id_key" ON "ItemLocal"("Item_id", "Local_id");
