CREATE UNIQUE INDEX IF NOT EXISTS idx_single_null ON Valor(Item_id, AF_id) WHERE data_fim IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_principal ON AF(Contrato_id) WHERE principal IS TRUE;
