export interface PageConfig {
    pageId?: string
    perPage?: number
}
export interface PageInfo {
    previousPage?: string
    nextPage?: string
}

export interface TransactionFilter {
    itemIdFrom?: string
    transactionDateFrom?: string
    transactionDateTo?: string
    bookingDateFrom?: string
    bookingDateTo?: string
    minAmount?: string
    maxAmount?: string
    type?: 'CREDIT' | 'DEBIT'
}