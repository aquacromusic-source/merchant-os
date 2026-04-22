export function money(n: number | undefined | null, cur = '€'): string {
  if (typeof n !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' ' + cur
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}
