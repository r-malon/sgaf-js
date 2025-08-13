-- name: GetItem :one
SELECT * FROM Item WHERE id = ?;

-- name: CreateItem :exec
INSERT INTO Item (AF_id, Local_id, descricao, banda_maxima, banda_instalada, data_instalacao, quantidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- name: ListItems :many
SELECT * FROM Item;

-- name: ListItemsByAF :many
SELECT * FROM Item
JOIN AF ON Item.AF_id = AF.id
WHERE AF_id = ?
ORDER BY data_instalacao DESC;

-- name: ListItemsByLocal :many
SELECT * FROM Item
JOIN Local ON Item.Local_id = Local.id
WHERE Local_id = ?
ORDER BY data_instalacao DESC;

-- name: UpdateItem :exec
UPDATE Item SET Local_id = ?, descricao = ?, banda_maxima = ?, banda_instalada = ?, data_instalacao = ?, quantidade = ?, status = ? WHERE id = ?;

-- name: DeleteItem :exec
DELETE FROM Item WHERE id = ?;
