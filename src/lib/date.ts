export function formatShortDate(input: string) {
  return new Date(`${input}T00:00:00`).toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatLongDate(input: string) {
  return new Date(`${input}T00:00:00`).toLocaleDateString('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
