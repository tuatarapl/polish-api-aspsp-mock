import { TransactionDetail, TransactionDetailExt } from './model'

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

export function setupTransactions(newTransactionData: TransactionData) {
    transactionData = newTransactionData
}
