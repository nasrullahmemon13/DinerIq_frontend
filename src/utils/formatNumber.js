export function formatNumber(value, locales, options) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Unavailable';
  return value.toLocaleString(locales, options);
}
