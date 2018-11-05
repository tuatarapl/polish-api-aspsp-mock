import {expect} from 'chai'
import 'mocha'
import { CurrencyRate, DictionaryItem, Map, NameAddress, Payor, SenderRecipient, TransactionDetailExt,
    TransactionInfoCard, TransactionInfoTax, TransactionInfoZUS } from '../../src/service/model'
import * as service from '../../src/service/transactions'
import { Func } from 'mocha';
import { TransactionFilter } from '../../src/controllers/model';

describe('service', function() {
    describe('transactions', function() {
        const user = 'user'
        const accountNumber = 'accountNumber'
        const accountNumber2 = 'accountNumber2'
        const itemId = 'itemId'
        const itemIdHold = 'itemIdHold'
        const itemIdPending = 'itemIdPending'
        const itemIdRejected = 'itemIdRejected'
        const itemIdCancelled = 'itemIdCancelled'
        const itemIdScheduled = 'itemIdScheduled'
        const amount = '20.00'
        const amountNext = '100.00'
        const amountPrev = '3.00'
        const currency = 'currency'
        const description = 'description'
        const transactionType = 'transactionType'
        const tradeDate = '2000-10-10T00:00:000'
        const tradeDateNext = '2000-10-11T00:00:000'
        const tradeDatePrev = '2000-10-09T00:00:000'
        const mcc = 'mcc'
        const auxData: Map = {
            aaa: 'bbb'
        }
        const transactionCategory = 'CREDIT'
        const transactionStatus: DictionaryItem = {}
        const initiator: NameAddress = {}
        const sender: SenderRecipient = {}
        const recipient: SenderRecipient = {}
        const bookingDate = '2001-10-10T00:00:000'
        const bookingDateNext = '2001-10-11T00:00:000'
        const bookingDatePrev = '2001-10-09T00:00:000'
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
                    [itemIdHold]: {
                        ...transaction,
                        baseInfo: {
                            ...transaction.baseInfo,
                            itemId: itemIdHold
                        },
                        holdExpirationDate: null,

                        kind: 'hold'
                    },
                    [itemIdPending]: {
                        ...transaction,
                        baseInfo: {
                            ...transaction.baseInfo,
                            itemId: itemIdPending
                        },
                        kind: 'pending'
                    },
                    [itemIdRejected]: {
                        ...transaction,
                        baseInfo: {
                            ...transaction.baseInfo,
                            itemId: itemIdRejected
                        },
                        rejectionReason: null,
                        kind: 'rejected'
                    },
                    [itemIdCancelled]: {
                        ...transaction,
                        baseInfo: {
                            ...transaction.baseInfo,
                            itemId: itemIdCancelled
                        },
                        kind: 'cancelled'
                    },
                    [itemIdScheduled]: {
                        ...transaction,
                        baseInfo: {
                            ...transaction.baseInfo,
                            itemId: itemIdScheduled
                        },
                        kind: 'scheduled'
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
            it('should use values from  baseInfo for holdExpirationDate', function() {
                expect(service.getTransactionDetail(user, accountNumber, itemIdHold)).to.be.deep.equals({
                    baseInfo: {
                        itemId: itemIdHold,
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
            it('should use values from  baseInfo for rejectionReason', function() {
                expect(service.getTransactionDetail(user, accountNumber, itemIdRejected)).to.be.deep.equals({
                    baseInfo: {
                        itemId: itemIdRejected,
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
        function sharedTests<T>(f: (userId: string, accountNumber: string, filter: TransactionFilter) => T[] ) {
            it('should filter out on item id', function() {
                expect(f(user, accountNumber, {
                    itemIdFrom: itemId + 'A'
                })).to.be.deep.equals([])
            })
            it('should filter out on trade date', function() {
                expect(f(user, accountNumber, {
                    transactionDateFrom: tradeDateNext
                })).to.be.deep.equals([])
            })
            it('should filter out on trade date', function() {
                expect(f(user, accountNumber, {
                    transactionDateTo: tradeDatePrev
                })).to.be.deep.equals([])
            })
            it('should filter out on booking date', function() {
                expect(f(user, accountNumber, {
                    bookingDateFrom: bookingDateNext
                })).to.be.deep.equals([])
            })
            it('should filter out on booking date', function() {
                expect(f(user, accountNumber, {
                    bookingDateTo: bookingDatePrev
                })).to.be.deep.equals([])
            })
            it('should filter out on amount', function() {
                expect(f(user, accountNumber, {
                    maxAmount: amountPrev
                })).to.be.deep.equals([])
            })
            it('should filter out on amount', function() {
                expect(f(user, accountNumber, {
                    minAmount: amountNext
                })).to.be.deep.equals([])
            })
            it('should filter out category', function() {
                expect(f(user, accountNumber, {
                    type: 'DEBIT'
                })).to.be.deep.equals([])
            })
            it('should reject invalid user', function() {
                expect(f(`!${user}`, accountNumber, {})).to.be.deep.equals([])
            })
            it('should reject invalid accountNumber', function() {
                expect(f(user, `!${accountNumber}`, {})).to.be.deep.equals([])
            })
        }
        describe('getTransactionsDone', function() {
            it('should get transactions', function() {
                expect(service.getTransactionsDone(user, accountNumber, {})).to.be.deep.equals([{
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
                }])
            })
            sharedTests(service.getTransactionsDone)
        })
    })
})
