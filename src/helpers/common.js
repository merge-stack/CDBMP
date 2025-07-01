export function formatNumericValue(value, fractionDigits, useGrouping = false) {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';

  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping,
  });
}

export function formatBudgetRange(min, max, fractionDigits = 0) {
  if (
    typeof min !== 'number' ||
    typeof max !== 'number' ||
    (min === 0 && max === 0)
  ) {
    return 'N/A';
  }

  return `${formatNumericValue(
    min / 1000,
    fractionDigits,
    true
  )}K–${formatNumericValue(max / 1000, fractionDigits, true)}K euro`;
}
