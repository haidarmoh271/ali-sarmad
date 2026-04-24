/**
 * Format a number as Iraqi Dinar: whole number, comma every 3 digits, د.ع suffix
 * e.g. 1500000.5 → "1,500,000 د.ع"
 */
export function formatIQD(amount: number): string {
  return Math.round(amount).toLocaleString('en-US') + ' د.ع';
}
