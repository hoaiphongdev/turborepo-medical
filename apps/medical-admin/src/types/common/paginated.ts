export type PaginatedType = {
  page: number
  limit: number
  totalPages: number
  totalRecords: number
  currentRecords: number
  records: Array<unknown>
}
