export function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s\s+/g, ' ')
    .toLowerCase()
}
