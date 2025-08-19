-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AF" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "descricao" TEXT,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL
);
INSERT INTO "new_AF" ("data_fim", "data_inicio", "descricao", "fornecedor", "id", "numero", "status") SELECT "data_fim", "data_inicio", "descricao", "fornecedor", "id", "numero", "status" FROM "AF";
DROP TABLE "AF";
ALTER TABLE "new_AF" RENAME TO "AF";
CREATE UNIQUE INDEX "AF_numero_key" ON "AF"("numero");
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AF_id" INTEGER NOT NULL,
    "Local_id" INTEGER NOT NULL,
    "descricao" TEXT,
    "banda_maxima" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "Item_AF_id_fkey" FOREIGN KEY ("AF_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_Local_id_fkey" FOREIGN KEY ("Local_id") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("AF_id", "Local_id", "banda_instalada", "banda_maxima", "data_instalacao", "descricao", "id", "quantidade", "status") SELECT "AF_id", "Local_id", "banda_instalada", "banda_maxima", "data_instalacao", "descricao", "id", "quantidade", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
