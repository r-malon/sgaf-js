-- name: GetLocal :one
SELECT * FROM Local WHERE id = ?;

-- name: CreateLocal :exec
INSERT INTO Local (nome) VALUES (?);

-- name: ListLocals :many
SELECT * FROM Local;

-- name: UpdateLocal :exec
UPDATE Local SET nome = ? WHERE id = ?;

-- name: DeleteLocal :exec
DELETE FROM Local WHERE id = ?;
