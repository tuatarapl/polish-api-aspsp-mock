
import { TransactionDetail, TransactionInfo, TransactionPendingInfo, 
    TransactionRejectedInfo, TransactionCancelledInfo, 
    TransactionScheduledInfo, HoldInfo, ExecutionMode, PaymentDomestic, 
    PaymentEEA, PaymentNonEEA, PaymentTax, PaymentBundle } from 'polish-api-model'

export * from 'polish-api-model'
export type TransactionKind = 'done' | 'pending' | 'rejected' | 'cancelled' | 'scheduled' | 'hold'
export interface TransactionDetailExt extends TransactionDetail {
    baseInfo: TransactionInfo 
        & TransactionPendingInfo 
        & TransactionRejectedInfo 
        & TransactionCancelledInfo 
        & TransactionScheduledInfo
        & HoldInfo
    kind: TransactionKind
}

export type GeneralStatus = 'submitted'| 'cancelled' | 'pending' | 'done' | 'rejected' | 'scheduled'
export interface PaymentContainer {
    kind: 'domestic' | 'EEA' | 'nonEEA' | 'tax'
    paymentId: string
    generalStatus: GeneralStatus
    detailedStatus: string
    executionMode: ExecutionMode
}

export interface PaymentContainerDomestic  extends PaymentContainer {
    kind: 'domestic'
    payment: PaymentDomestic
}
export interface PaymentContainerEEA  extends PaymentContainer {
    kind: 'EEA'
    payment: PaymentEEA
}
export interface PaymentContainerNonEEA  extends PaymentContainer {
    kind: 'nonEEA'
    payment: PaymentNonEEA
}
export interface PaymentContainerTax  extends PaymentContainer {
    kind: 'tax'
    payment: PaymentTax
}

export type BundleStatus = 'inProgress' | 'cancelled' | 'done' | 'partiallyDone' 
export interface PaymentBundleContainer {
    bundle: PaymentBundle
    bundleId?: string
    bundleStatus?: BundleStatus
    payments: AddPayment[]
}

export interface AddPayment {
    paymentId: string
    generalStatus: GeneralStatus
    detailedStatus: string
}

export interface GetPayment extends AddPayment {
    executionMode: ExecutionMode
}

export interface AddBundle {
    bundleId?:string
    bundleStatus: BundleStatus
}

export interface GetBundle extends AddBundle {
    payments?: GetPayment[]
}