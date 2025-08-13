-- name: GetAF :one
SELECT * FROM AF WHERE id = ?;

-- name: CreateAF :exec
INSERT INTO AF (numero, fornecedor, descricao, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?);

-- name: ListAFs :many
SELECT * FROM AF ORDER BY numero;

-- name: UpdateAF :exec
UPDATE AF SET numero = ?, fornecedor = ?, descricao = ?, data_inicio = ?, data_fim = ?, status = ? WHERE id = ?;

-- name: DeleteAF :exec
DELETE FROM AF WHERE id = ?;
