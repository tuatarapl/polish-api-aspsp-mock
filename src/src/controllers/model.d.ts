import { TokenData } from "../service/token";
import { Consent } from "../service/consent";

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

declare module 'swagger-tools' {
    interface Swagger20Request<P extends SwaggerRequestParameters> {
        token: string
        tokenData: TokenData
        consentId: string
        consent: Consent
    }
}