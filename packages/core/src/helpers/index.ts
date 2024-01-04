export const delay = (milliseconds: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

export const formatCurrencyVN = (number?: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
    // minimumFractionDigits: 0
  }).format(number ?? 0)
}
