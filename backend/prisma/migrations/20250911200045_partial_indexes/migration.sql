CREATE UNIQUE INDEX idx_single_null ON Valor(Item_id) WHERE data_fim = NULL;
CREATE UNIQUE INDEX idx_single_principal ON AF(Contrato_id) WHERE principal = true;
