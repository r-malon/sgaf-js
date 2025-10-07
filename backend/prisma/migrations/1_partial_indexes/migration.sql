CREATE UNIQUE INDEX IF NOT EXISTS idx_single_null ON Valor(itemId, afId) WHERE data_fim IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_principal ON AF(contratoId) WHERE principal IS TRUE;
