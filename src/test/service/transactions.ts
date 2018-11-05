import {expect} from 'chai'
import 'mocha'
import { CurrencyRate, DictionaryItem, Map, NameAddress, Payor, SenderRecipient, TransactionDetailExt,
    TransactionInfoCard, TransactionInfoTax, TransactionInfoZUS } from '../../src/service/model'
import * as service from '../../src/service/transactions'

describe('service', function() {
    describe('transactions', function() {
        const user = 'user'
        const accountNumber = 'accountNumber'
        const accountNumber2 = 'accountNumber2'
        const itemId = 'itemId'
        const itemId2 = 'itemId2'
        const amount = 'amount'
        const currency = 'currency'
        const description = 'description'
        const transactionType = 'transactionType'
        const tradeDate = 'tradeDate'
        const mcc = 'mcc'
        const auxData: Map = {
            aaa: 'bbb'
        }
        const transactionCategory = 'CREDIT'
        const transactionStatus: DictionaryItem = {}
        const initiator: NameAddress = {}
        const sender: SenderRecipient = {}
        const recipient: SenderRecipient = {}
        const bookingDate = 'bookingDate'
        const postTransactionBalance = 'postTransactionBalance'
        const rejectionReason = 'rejectionReason'
        const holdExpirationDate = 'holdExpirationDate'
        const rejectionDate = 'rejectionDate'
        const zusInfo: TransactionInfoZUS = {}
        const formCode = 'formCode'
        const obligationId = 'obligationId'
        const payorId = 'payorId'
        const payorIdType = 'P'
        const payerInfo: Payor = {
            payorId,
            payorIdType
        }
        const periodId = 'periodId'
        const periodType = 'periodType'
        const year = 2000
        const usInfo: TransactionInfoTax = {
            formCode,
            obligationId,
            payerInfo,
            periodId,
            periodType,
            year
        }
        const cardInfo: TransactionInfoCard = {}
        const currencyDate = 'currencyDate'
        const transactionRate: CurrencyRate[] = [{}]
        const baseCurrency = 'baseCurrency'
        const amountBaseCurrency = 'amountBaseCurrency'
        const usedPaymentInstrumentId = 'usedPaymentInstrumentId'
        const tppTransactionId = 'tppTransactionId'
        const tppName = 'tppName'
        const transaction: TransactionDetailExt = {
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
                postTransactionBalance,
                rejectionReason,
                holdExpirationDate,
                rejectionDate
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
            holdExpirationDate,
            kind: 'done'
        }
        service.setupTransactions({
            [user]: {
                [accountNumber]: {
                    [itemId]: transaction,
                    [itemId2]: {
                        ...transaction,
                        baseInfo: {
                            ...transaction.baseInfo,
                            itemId: itemId2
                        },
                        holdExpirationDate: null,
                        rejectionReason: null
                    }
                }
            }
        })
        describe('getTransactionDetail', function() {
            it('should get transaction', function() {
                expect(service.getTransactionDetail(user, accountNumber, itemId)).to.be.deep.equals({
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
                    rejectionReason,
                    holdExpirationDate
                })
            })
            it('should use values from  baseInfo for rejectionReason and holdExpirationDate', function() {
                expect(service.getTransactionDetail(user, accountNumber, itemId2)).to.be.deep.equals({
                    baseInfo: {
                        itemId: itemId2,
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
                    rejectionReason,
                    holdExpirationDate
                })
            })
            it('should reject invalid user', function() {
                expect(service.getTransactionDetail(`!${user}`, accountNumber, itemId)).to.be.null
            })
            it('should reject invalid accountNumber', function() {
                expect(service.getTransactionDetail(user, `!${accountNumber}`, itemId)).to.be.null
            })
            it('should reject invalid itemId', function() {
                expect(service.getTransactionDetail(user, accountNumber, `!${itemId}`)).to.be.null
            })
        })
    })
})
