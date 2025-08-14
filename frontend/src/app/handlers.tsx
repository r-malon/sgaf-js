async function handleDelete(id: number) {
  mutate(`${API_BASE_URL}/af`, (current: AF[] = []) => current.filter((af) => af.id !== id), false)

  try {
    const res = await fetch(`${API_BASE_URL}/af/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    mutate(`${API_BASE_URL}/af`)
  } catch (error) {
    console.error("Falha ao excluir AF:", error)
    mutate(`${API_BASE_URL}/af`)
  }
}

async function handleEdit(af: AF) {
  const updated: AF = {
    ...af,
    fornecedor: af.fornecedor + " (editado)",
  }

  mutate(
    `${API_BASE_URL}/af`,
    (current: AF[] = []) => current.map((item) => (item.id === af.id ? updated : item)),
    false
  )

  try {
    const res = await fetch(`${API_BASE_URL}/af/${af.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    mutate(`${API_BASE_URL}/af`)
  } catch (error) {
    console.error("Falha ao atualizar AF:", error)
    mutate(`${API_BASE_URL}/af`)
  }
}
