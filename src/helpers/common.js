export function formatNumericValue(value, fractionDigits, useGrouping = false) {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';

  const absValue = Math.abs(value); // to handle negatives

  if (absValue >= 10000) {
    // Get first 4 digits only
    const digitsOnly = Math.floor(absValue).toString().slice(0, 4);
    const formatted = useGrouping
      ? Number(digitsOnly).toLocaleString('en-US')
      : digitsOnly;
    return `${formatted}...`;
  }

  const isWhole = Number.isInteger(value);

  return value.toLocaleString('en-US', {
    minimumFractionDigits: isWhole ? 0 : fractionDigits,
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
  )}–${formatNumericValue(max / 1000, fractionDigits, true)}K euro`;
}
