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
    "contratoId" INTEGER NOT NULL,
    "principal" BOOLEAN NOT NULL,
    "numero" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "descricao" TEXT,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "AF_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "principalId" INTEGER NOT NULL,
    "descricao" TEXT,
    "data_alteracao" DATETIME,
    "banda_maxima" INTEGER NOT NULL,
    "quantidade_maxima" INTEGER NOT NULL,
    CONSTRAINT "Item_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Instalacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "banda_instalada" INTEGER NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "data_desinstalacao" DATETIME,
    "quantidade" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    CONSTRAINT "Instalacao_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Instalacao_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Valor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "afId" INTEGER NOT NULL,
    "valor" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    CONSTRAINT "Valor_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Valor_afId_fkey" FOREIGN KEY ("afId") REFERENCES "AF" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
CREATE INDEX "AF_contratoId_idx" ON "AF"("contratoId");

-- CreateIndex
CREATE INDEX "Item_principalId_idx" ON "Item"("principalId");

-- CreateIndex
CREATE INDEX "Instalacao_itemId_idx" ON "Instalacao"("itemId");

-- CreateIndex
CREATE INDEX "Instalacao_localId_idx" ON "Instalacao"("localId");

-- CreateIndex
CREATE UNIQUE INDEX "Instalacao_itemId_localId_key" ON "Instalacao"("itemId", "localId");

-- CreateIndex
CREATE INDEX "Valor_itemId_idx" ON "Valor"("itemId");

-- CreateIndex
CREATE INDEX "Valor_afId_idx" ON "Valor"("afId");

-- CreateIndex
CREATE UNIQUE INDEX "_AFToItem_AB_unique" ON "_AFToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_AFToItem_B_index" ON "_AFToItem"("B");

