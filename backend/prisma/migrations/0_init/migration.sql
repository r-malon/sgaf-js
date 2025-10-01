-- CreateTable
CREATE TABLE "Local" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nome_normalized" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AF" (
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

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "principal_id" INTEGER NOT NULL,
    "descricao" TEXT,
    "data_alteracao" DATETIME,
    "banda_maxima" INTEGER NOT NULL,
    "quantidade_maxima" INTEGER NOT NULL,
    CONSTRAINT "Item_principal_id_fkey" FOREIGN KEY ("principal_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemLocal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Item_id" INTEGER NOT NULL,
    "Local_id" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "data_desinstalacao" DATETIME,
    "quantidade" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "ItemLocal_Item_id_fkey" FOREIGN KEY ("Item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemLocal_Local_id_fkey" FOREIGN KEY ("Local_id") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Valor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Item_id" INTEGER NOT NULL,
    "AF_id" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    CONSTRAINT "Valor_Item_id_fkey" FOREIGN KEY ("Item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Valor_AF_id_fkey" FOREIGN KEY ("AF_id") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AFToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AFToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "AF" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AFToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Local_nome_key" ON "Local"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Local_nome_normalized_key" ON "Local"("nome_normalized");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_numero_key" ON "Contrato"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "AF_numero_key" ON "AF"("numero");

-- CreateIndex
CREATE INDEX "AF_Contrato_id_idx" ON "AF"("Contrato_id");

-- CreateIndex
CREATE INDEX "Item_principal_id_idx" ON "Item"("principal_id");

-- CreateIndex
CREATE INDEX "ItemLocal_Item_id_idx" ON "ItemLocal"("Item_id");

-- CreateIndex
CREATE INDEX "ItemLocal_Local_id_idx" ON "ItemLocal"("Local_id");

-- CreateIndex
CREATE UNIQUE INDEX "ItemLocal_Item_id_Local_id_key" ON "ItemLocal"("Item_id", "Local_id");

-- CreateIndex
CREATE INDEX "Valor_Item_id_idx" ON "Valor"("Item_id");

-- CreateIndex
CREATE INDEX "Valor_AF_id_idx" ON "Valor"("AF_id");

-- CreateIndex
CREATE UNIQUE INDEX "_AFToItem_AB_unique" ON "_AFToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_AFToItem_B_index" ON "_AFToItem"("B");

