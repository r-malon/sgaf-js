-- name: GetValor :one
SELECT * FROM Valor WHERE id = ?;

-- name: CreateValor :exec
INSERT INTO Valor (Item_id, valor, data_inicio, data_fim) VALUES (?, ?, ?, ?);

-- name: ListValors :many
SELECT * FROM Valor;

-- name: ListValorsByItem :many
SELECT * FROM Valor
JOIN Item ON Valor.Item_id = Item.id
WHERE Item_id = ?
ORDER BY data_inicio DESC;

-- name: UpdateValor :exec
UPDATE Valor SET Item_id = ?, valor = ?, data_inicio = ?, data_fim = ? WHERE id = ?;

-- name: DeleteValor :exec
DELETE FROM Valor WHERE id = ?;
