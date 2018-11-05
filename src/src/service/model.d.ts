export interface DictionaryItem {
    code?: string
    description?: string
}
export interface AccountBaseInfo {
    accountNumber:	string
    accountTypeName: string
    accountType: DictionaryItem
}

export interface NameAddress {
    value?: string[]
}

type Address = string[]

export interface BankAccountInfo {
    bicOrSwift?: string
    name?: string
    address?: Address
}
export interface Map {
    [key: string]: string
}

export interface Bank {
    bicOrSwift?: string
    name?: string
    code?: string
    countryCode?: string
    address?: Address
}

export interface AccountInfo {
    accountNumber: string
    nameAddress: NameAddress
    accountType: DictionaryItem
    accountTypeName?: string
    accountHolderType: 'individual' | 'corporation'
    accountNameClient?: string
    currency: string
    availableBalance: string
    bookingBalance: string
    bank: BankAccountInfo
    auxData: Map
}

export interface SenderRecipient {
    accountNumber?: string
    accountMassPayment?: string
    bank?: Bank
    nameAddress?: NameAddress
}

export interface TransactionInfo {
    itemId: string
    amount: string
    currency?: string
    description?: string
    transactionType?: string
    tradeDate?: string
    mcc?: string
    auxData?: Map
    transactionCategory: 'CREDIT' | 'DEBIT'
    transactionStatus?: DictionaryItem
    initiator?: NameAddress
    sender?: SenderRecipient
    recipient?: SenderRecipient
    bookingDate?: string
    postTransactionBalance?: string
}

export interface TransactionPendingInfo {
    itemId: string
    amount: string
    currency?: string
    description?: string
    transactionType?: string
    tradeDate?: string
    mcc?: string
    auxData?: Map
    transactionCategory: 'CREDIT' | 'DEBIT'
    initiator?: NameAddress
    sender?: SenderRecipient
    recipient?: SenderRecipient
}

export interface TransactionRejectedInfo {
    itemId: string
    amount: string
    currency?: string
    description?: string
    transactionType?: string
    tradeDate?: string
    mcc?: string
    auxData?: Map
    transactionCategory: 'CREDIT' | 'DEBIT'
    initiator?: NameAddress
    sender?: SenderRecipient
    recipient?: SenderRecipient
    rejectionReason?: string
    rejectionDate?: string
}

export interface TransactionCancelledInfo {
    itemId: string
    amount: string
    currency?: string
    description?: string
    transactionType?: string
    tradeDate?: string
    mcc?: string
    auxData?: Map
    transactionCategory: 'CREDIT' | 'DEBIT'
    transactionStatus?: DictionaryItem
    initiator?: NameAddress
    sender?: SenderRecipient
    recipient?: SenderRecipient
}

export interface TransactionScheduledInfo {
    itemId: string
    amount: string
    currency?: string
    description?: string
    transactionType?: string
    tradeDate?: string
    mcc?: string
    auxData?: Map
    transactionCategory: string
    transactionStatus?: DictionaryItem
    initiator?: NameAddress
    sender?: SenderRecipient
    recipient?: SenderRecipient
}

export interface HoldInfo {
    itemId: string
    amount: string
    currency?: string
    description?: string
    transactionType?: string
    tradeDate?: string
    mcc?: string
    auxData?: Map
    holdExpirationDate?: string
    initiator?: NameAddress
    sender?: SenderRecipient
    recipient?: SenderRecipient
}

export interface SocialSecurityPayor {
    nip?: string
    additionalPayorId?: string
    additionalPayorIdType?: 'P' | 'R' | '1' | '2'
}

export interface TransactionInfoZUS {
    payerInfo?: SocialSecurityPayor
    contributionType?: string
    contributionId?: string
    contributionPeriod?: string
    paymentTypeId?: string
    obligationId?: string
}

export interface Payor {
    payorId: string
    payorIdType: 'N' | 'P' | 'R' | '1' | '2' | '3'
}

export interface TransactionInfoTax {
    payerInfo: Payor
    formCode: string
    periodId: string
    periodType: string
    year: number
    obligationId?: string
}

export interface TransactionInfoCard {
    cardHolder?: string
    cardNumber?: string
}

export interface CurrencyRate {
    rate?: number
    fromCurrency?: string
    toCurrency?: string
}

export interface TransactionDetail {
    baseInfo: TransactionInfo
    zusInfo?: TransactionInfoZUS
    usInfo?: TransactionInfoTax
    cardInfo?: TransactionInfoCard
    currencyDate?: string
    transactionRate?: CurrencyRate[]
    baseCurrency?: string
    amountBaseCurrency?: string
    usedPaymentInstrumentId?: string
    tppTransactionId?: string
    tppName?: string
    rejectionReason?: string
    holdExpirationDate?: string
}
