-- CreateTable
CREATE TABLE "AF" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Local" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AF_id" INTEGER NOT NULL,
    "Local_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "banda_maxima" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "Item_AF_id_fkey" FOREIGN KEY ("AF_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_Local_id_fkey" FOREIGN KEY ("Local_id") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Valor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Item_id" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    CONSTRAINT "Valor_Item_id_fkey" FOREIGN KEY ("Item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AF_numero_key" ON "AF"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Local_nome_key" ON "Local"("nome");
