export const formatCurrencyVND = (number?: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
    // minimumFractionDigits: 0
  }).format(number ?? 0)
}
