import * as _ from 'lodash'
import { TransactionFilter } from '../controllers/model'
import { HoldInfo, TransactionCancelledInfo, TransactionDetail,
    TransactionDetailExt, TransactionInfo, TransactionKind, TransactionPendingInfo,
    TransactionRejectedInfo, TransactionScheduledInfo } from './model'
interface TransactionData {
    [user: string]: {
        [accountNumber: string]: {
            [itemId: string]: TransactionDetailExt
        }
    }
}
let transactionData: TransactionData = {}

export function getTransactionDetail(user: string, accountNumber: string, itemId: string): TransactionDetail {
    const transaction = ((transactionData[user] || {})[accountNumber] || {})[itemId]
    if (transaction) {
        const {
            baseInfo: {
                amount,
                currency,
                description,
                transactionType,
                tradeDate,
                mcc,
                auxData,
                transactionCategory,
                transactionStatus,
                initiator,
                sender,
                recipient,
                bookingDate,
                postTransactionBalance,
                rejectionReason: baseRejectionReason,
                holdExpirationDate: baseHoldExpirationDate
            },
            zusInfo,
            usInfo,
            cardInfo,
            currencyDate,
            transactionRate,
            baseCurrency,
            amountBaseCurrency,
            usedPaymentInstrumentId,
            tppTransactionId,
            tppName,
            rejectionReason,
            holdExpirationDate
        } = transaction
        return {
            baseInfo: {
                itemId,
                amount,
                currency,
                description,
                transactionType,
                tradeDate,
                mcc,
                auxData,
                transactionCategory,
                transactionStatus,
                initiator,
                sender,
                recipient,
                bookingDate,
                postTransactionBalance
            },
            zusInfo,
            usInfo,
            cardInfo,
            currencyDate,
            transactionRate,
            baseCurrency,
            amountBaseCurrency,
            usedPaymentInstrumentId,
            tppTransactionId,
            tppName,
            rejectionReason: rejectionReason || baseRejectionReason,
            holdExpirationDate: holdExpirationDate || baseHoldExpirationDate
        }
    } else {
        return null
    }
}
function getTransactions(user: string, accountNumber: string, filter: TransactionFilter, kind: TransactionKind):
    TransactionDetailExt[] {
    return _((transactionData[user] || {})[accountNumber] || {}).values().filter((transaction) => {
        if (transaction.kind !== kind ) {
            return false
        }
        if (filter.type && filter.type !== transaction.baseInfo.transactionCategory) {
            return false
        }
        if (filter.itemIdFrom && filter.itemIdFrom > transaction.baseInfo.itemId) {
            return false
        }
        if (filter.transactionDateFrom && filter.transactionDateFrom > transaction.baseInfo.tradeDate) {
            return false
        }
        if (filter.transactionDateTo && filter.transactionDateTo < transaction.baseInfo.tradeDate) {
            return false
        }
        if (filter.bookingDateFrom && filter.bookingDateFrom > transaction.baseInfo.bookingDate) {
            return false
        }
        if (filter.bookingDateTo && filter.bookingDateTo < transaction.baseInfo.bookingDate) {
            return false
        }
        if (filter.minAmount && Number.parseFloat(filter.minAmount) > Number.parseFloat(transaction.baseInfo.amount)) {
            return false
        }
        if (filter.maxAmount && Number.parseFloat(filter.maxAmount) < Number.parseFloat(transaction.baseInfo.amount)) {
            return false
        }
        return true
    }).value()
}

export function getTransactionsDone(user: string, accountNumber: string, filter: TransactionFilter): TransactionInfo[] {
    return _.map(getTransactions(user, accountNumber, filter, 'done'), ({
        baseInfo: {
            itemId,
            amount,
            currency,
            description,
            transactionType,
            tradeDate,
            mcc,
            auxData,
            transactionCategory,
            transactionStatus,
            initiator,
            sender,
            recipient,
            bookingDate,
            postTransactionBalance
        }
    }) => ({
        itemId,
        amount,
        currency,
        description,
        transactionType,
        tradeDate,
        mcc,
        auxData,
        transactionCategory,
        transactionStatus,
        initiator,
        sender,
        recipient,
        bookingDate,
        postTransactionBalance
    }))
}

export function getTransactionsPending(user: string, accountNumber: string, filter: TransactionFilter):
    TransactionPendingInfo[] {
    return _.map(getTransactions(user, accountNumber, filter, 'pending'), ({
        baseInfo: {
            itemId,
            amount,
            currency,
            description,
            transactionType,
            tradeDate,
            mcc,
            auxData,
            transactionCategory,
            initiator,
            sender,
            recipient
        }
    }) => ({
        itemId,
        amount,
        currency,
        description,
        transactionType,
        tradeDate,
        mcc,
        auxData,
        transactionCategory,
        initiator,
        sender,
        recipient
    }))
}
export function getTransactionsRejected(user: string, accountNumber: string, filter: TransactionFilter):
    TransactionRejectedInfo[] {
    return _.map(getTransactions(user, accountNumber, filter, 'rejected'), ({
        baseInfo: {
            itemId,
            amount,
            currency,
            description,
            transactionType,
            tradeDate,
            mcc,
            auxData,
            transactionCategory,
            initiator,
            sender,
            recipient,
            rejectionReason,
            rejectionDate
        }
    }) => ({
        itemId,
        amount,
        currency,
        description,
        transactionType,
        tradeDate,
        mcc,
        auxData,
        transactionCategory,
        initiator,
        sender,
        recipient,
        rejectionReason,
        rejectionDate
    }))
}

export function getTransactionsCancelled(user: string, accountNumber: string, filter: TransactionFilter):
    TransactionCancelledInfo[] {
    return _.map(getTransactions(user, accountNumber, filter, 'cancelled'), ({
        baseInfo: {
            itemId,
            amount,
            currency,
            description,
            transactionType,
            tradeDate,
            mcc,
            auxData,
            transactionCategory,
            transactionStatus,
            initiator,
            sender,
            recipient
        }
    }) => ({
        itemId,
        amount,
        currency,
        description,
        transactionType,
        tradeDate,
        mcc,
        auxData,
        transactionCategory,
        transactionStatus,
        initiator,
        sender,
        recipient
    }))
}

export function getTransactionsScheduled(user: string, accountNumber: string, filter: TransactionFilter):
    TransactionScheduledInfo[] {
    return _.map(getTransactions(user, accountNumber, filter, 'scheduled'), ({
        baseInfo: {
            itemId,
            amount,
            currency,
            description,
            transactionType,
            tradeDate,
            mcc,
            auxData,
            transactionCategory,
            transactionStatus,
            initiator,
            sender,
            recipient
        }
    }) => ({
        itemId,
        amount,
        currency,
        description,
        transactionType,
        tradeDate,
        mcc,
        auxData,
        transactionCategory,
        transactionStatus,
        initiator,
        sender,
        recipient
    }))
}

export function getHolds(user: string, accountNumber: string, filter: TransactionFilter):
    HoldInfo[] {
    return _.map(getTransactions(user, accountNumber, filter, 'hold'), ({
        baseInfo: {
            itemId,
            amount,
            currency,
            description,
            transactionType,
            tradeDate,
            mcc,
            auxData,
            holdExpirationDate,
            initiator,
            sender,
            recipient
        }
    }) => ({
        itemId,
        amount,
        currency,
        description,
        transactionType,
        tradeDate,
        mcc,
        auxData,
        holdExpirationDate,
        initiator,
        sender,
        recipient
    }))
}

export function setupTransactions(newTransactionData: TransactionData) {
    transactionData = newTransactionData
}

export function list(user: string, accountNumber: string): TransactionDetailExt[] {
    return _((transactionData[user] || {})[accountNumber] || {}).values().value()
}

export function get(user: string, accountNumber: string, itemId: string): TransactionDetailExt {
    return ((transactionData[user] || {})[accountNumber] || {})[itemId]
}
