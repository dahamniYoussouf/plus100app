/**
 * Utility functions for currency formatting
 * All prices are in DZD (Algerian Dinar)
 */

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('fr-DZ')} د.ج`
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M د.ج`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K د.ج`
  }
  return `${amount} د.ج`
}


