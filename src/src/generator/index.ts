import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as _ from 'lodash'
import * as moment from 'moment'
import * as uuid4 from 'uuid/v4'
import { AccountBaseInfo, AccountHolderType, AccountInfo, AdditionalPayorIdType,
    Address, Bank, CurrencyRate, DictionaryItem,
    NameAddress, PayorIdType, SenderRecipient,
    TransactionCategory, TransactionDetailExt, TransactionInfoCard,
    TransactionInfoTax, TransactionInfoZUS, TransactionKind } from '../service/model'
import { User } from '../service/user'

interface Reference {
    cities: string[]
    countries: string[]
    locations: string[]
    locationPrefixes: string[]
    currencies: string[]
    accountTypes: DictionaryItem[]
    accountNamesClient: string[]
    namesIndividual: string[]
    namesCorporation: string[]
    ownBanks: Bank[]
    otherBanks: Bank[]
    descriptions: string[]
    transactionTypes: string[]
    transactionStatuses: DictionaryItem[]
    tppNames: string[]
    rejectionReasons: string[]
    formCodes: string[]
    contributionIds: string[]
    contributionTypes: string[]
    paymentTypeIds: string[]
}

export class Generator {
    private reference: Reference
    constructor() {
        this.reference = yaml.safeLoad(fs.readFileSync('reference/data.yaml', 'UTF-8'))
    }

    public generateUsers(count: number): User[] {
        return _.range(count).map((i) => ({username: `user${i}`, password: 'password' }))
    }
    public generateAccounts(count: number): Array<AccountBaseInfo & AccountInfo> {
        const accountHolderType: AccountHolderType = this.generateAccountHolderType()
        const nameAddress: NameAddress = this.generateNameAddress(accountHolderType)
        const bank: Bank = this.generateOwnBank()
        return _.range(count).map(() => this.generateAccount(nameAddress, bank, accountHolderType))
    }

    public generateAccount(nameAddress: NameAddress, bank: Bank, accountHolderType: AccountHolderType):
        AccountBaseInfo & AccountInfo {
        const accountType: DictionaryItem = this.generateAccountType()
        return {
            accountNumber: this.generateAccountNumber(),
            nameAddress,
            accountType,
            accountTypeName: accountType && accountType.description,
            accountHolderType,
            accountNameClient: this.generateAccountNameClient(),
            currency: this.generateCurrency(),
            availableBalance: this.generateAmount(),
            bookingBalance: this.generateAmount(),
            bank,
            auxData: {}
        }
    }

    public generateTransactions(count: number, account: AccountBaseInfo & AccountInfo): TransactionDetailExt[] {
        return _.range(count).map(() => this.generateTransaction(account))
    }

    private generateTransactionCategory(): TransactionCategory {
        return this.pick(['CREDIT', 'DEBIT'] as TransactionCategory[])
    }

    private generateDescription(): string {
        return this.pick(this.reference.descriptions)
    }

    private generateTransactionType(): string {
        return this.pick(this.reference.transactionTypes)
    }

    private generateDate(): string {
        return moment().subtract(_.random(60 * 60 * 24 * 365 * 4), 'seconds').toISOString()
    }

    private generateMCC(): string {
        return this.randomDigits(4)
    }

    private generateTransactionStatus(): DictionaryItem {
        return this.pick(this.reference.transactionStatuses)
    }

    private generateOtherBank(): Bank {
        return this.pick(this.reference.otherBanks)
    }

    private generateNip(): string {
        return this.randomDigits(10)
    }

    private generateAdditionalPayorId(): string {
        return this.randomDigits(_.random(5, 15))
    }

    private generateAdditionalPayorIdType(): AdditionalPayorIdType {
        return this.pick(['P', 'R', '1', '2'] as AdditionalPayorIdType[])
    }

    private generateContributionId(): string {
        return this.pick(this.reference.contributionIds)
    }

    private generateContributionPeriod(): string {
        return `${this.generateYear()}${this.generateMonth()}`
    }

    private generateContributionType(): string {
        return this.pick(this.reference.contributionTypes)
    }

    private generatePaymentTypeId(): string {
        return this.pick(this.reference.paymentTypeIds)
    }

    private generateZusInfo(): TransactionInfoZUS {
        return {
            payerInfo: {
                additionalPayorId: this.generateAdditionalPayorId(),
                additionalPayorIdType: this.generateAdditionalPayorIdType(),
                nip: this.generateNip()
            },
            obligationId: this.generateObligationId(),
            contributionId: this.generateContributionId(),
            contributionPeriod: this.generateContributionPeriod(),
            contributionType: this.generateContributionType(),
            paymentTypeId: this.generatePaymentTypeId()
        }
    }
    private generateFormCode(): string {
        return this.pick(this.reference.formCodes)
    }
    private generateObligationId(): string {
        return uuid4()
    }
    private generatePayorId(): string {
        return this.randomDigits(13)
    }
    private generatePayorIdType(): PayorIdType {
        return this.pick(['N' , 'P' , 'R' , '1' , '2' , '3'] as PayorIdType[])
    }

    private generateMonth(): string {
        return this.pick(['01', '02', '03', '04', '05', '06',
        '07', '08', '09', '10', '11', '12'])
    }

    private generateDay(): string {
        return this.pick(['01', '02', '03', '04', '05', '06', '07',
        '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
    }

    private generateQuarter(): string {
        return this.pick(['01', '02', '03', '04'])
    }

    private generateMonthDecade(): string {
        return this.pick(['01', '02', '03'])
    }

    private generatePeriodId(periodType: string): string {
        switch (periodType) {
            case 'R': return ``
            case 'K': return `${this.generateQuarter()}`
            case 'M': return `${this.generateMonth()}`
            case 'D': return `${this.generateMonth()}${this.generateMonthDecade()}`
            case 'J': return `${this.generateDay()}`
        }

    }
    private generatePeriodType(): string {
        return this.pick(['R', 'K', 'M', 'D', 'J'])
    }
    private generateYear(): number {
        return _.random(1980, 2020)
    }

    private generateUsInfo(): TransactionInfoTax {
        const periodType = this.generatePeriodType()
        return {
            formCode: this.generateFormCode(),
            obligationId: this.generateObligationId(),
            payerInfo: {
                payorId: this.generatePayorId(),
                payorIdType: this.generatePayorIdType()
            },
            periodId: this.generatePeriodId(periodType),
            periodType,
            year: this.generateYear()
        }
    }

    private generateCardNumber(): string {
        return this.randomDigits(16)
    }

    private generateCardInfo(account: AccountBaseInfo & AccountInfo): TransactionInfoCard {
        return {
            cardHolder: account.nameAddress.value[0],
            cardNumber: this.generateCardNumber()
        }
    }

    private generateTransactionRates(): CurrencyRate[] {
        return [{
            fromCurrency: this.generateCurrency(),
            toCurrency: this.generateCurrency(),
            rate: _.random(100, true) / _.random(100, true)
        }]
    }

    private generatePaymentInstrumentId(): string {
        return this.generateCardNumber()
    }
    private generateTppTransactionId(): string {
        return uuid4()
    }
    private generateTppName(): string {
        return this.pick(this.reference.tppNames)
    }
    private generateRejectionReason(): string {
        return this.pick(this.reference.rejectionReasons)
    }

    private mapAccountToSenderRecipient(account: AccountBaseInfo & AccountInfo): SenderRecipient {
        return {
            accountNumber: account.accountNumber,
            bank: account.bank,
            nameAddress: account.nameAddress
        }
    }

    private generateCounterpart(): AccountBaseInfo & AccountInfo {
        const accountType = this.generateAccountType()
        const accountHolderType = this.generateAccountHolderType()
        return {
            accountNumber: this.generateAccountNumber(),
            accountHolderType,
            accountType,
            accountTypeName: accountType && accountType.description,
            auxData: {},
            availableBalance: this.generateAmount(),
            bank: this.generateOtherBank(),
            bookingBalance: this.generateAmount(),
            currency: this.generateCurrency(),
            nameAddress: this.generateNameAddress(accountHolderType)
        }
    }

    public generateTransactionBase(account: AccountBaseInfo & AccountInfo, kind: TransactionKind):
        TransactionDetailExt {
        const transactionCategory: TransactionCategory = this.generateTransactionCategory()
        const counterpart: AccountBaseInfo & AccountInfo = this.generateCounterpart()
        const sender: SenderRecipient = transactionCategory === 'DEBIT' ?
            this.mapAccountToSenderRecipient(account) :
            this.mapAccountToSenderRecipient(counterpart)
        const recipient: SenderRecipient = transactionCategory === 'CREDIT' ?
            this.mapAccountToSenderRecipient(account) :
            this.mapAccountToSenderRecipient(counterpart)
        const zusInfo = _.random(5) ? null : this.generateZusInfo()
        const usInfo = _.random(5) ? null : this.generateUsInfo()
        const cardInfo = _.random(5) ? null : this.generateCardInfo(account)
        return {
            baseInfo: {
                itemId: this.generateItemId(),
                amount: this.generateAmount(),
                currency: this.generateCurrency(),
                description: this.generateDescription(),
                transactionType: this.generateTransactionType(),
                tradeDate: this.generateDate(),
                mcc: this.generateMCC(),
                auxData: {},
                transactionCategory,
                transactionStatus: this.generateTransactionStatus(),
                initiator: sender.nameAddress,
                sender,
                recipient,
                bookingDate: this.generateDate(),
                postTransactionBalance: this.generateAmount()
            },
            zusInfo,
            usInfo,
            cardInfo,
            currencyDate: this.generateDate(),
            transactionRate: this.generateTransactionRates(),
            baseCurrency: this.generateCurrency(),
            amountBaseCurrency: this.generateAmount(),
            usedPaymentInstrumentId: this.generatePaymentInstrumentId(),
            tppTransactionId: this.generateTppTransactionId(),
            tppName: this.generateTppName(),
            rejectionReason: this.generateRejectionReason(),
            holdExpirationDate: this.generateDate(),
            kind
        }
    }

    public generateItemId(): string {
        return uuid4()
    }
    public generateDoneTransaction(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        const baseTransaction = this.generateTransactionBase(account, 'done')
        return baseTransaction
    }
    public generatePendingTransaction(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        const baseTransaction = this.generateTransactionBase(account, 'pending')
        return baseTransaction
    }
    public generateRejectedTransaction(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        const baseTransaction = this.generateTransactionBase(account, 'rejected')
        return baseTransaction
    }
    public generateScheduledTransaction(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        const baseTransaction = this.generateTransactionBase(account, 'scheduled')
        return baseTransaction
    }
    public generateCancelledTransaction(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        const baseTransaction = this.generateTransactionBase(account, 'cancelled')
        return baseTransaction
    }

    public generateHold(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        const baseTransaction = this.generateTransactionBase(account, 'hold')
        return baseTransaction
    }

    public generateTransaction(account: AccountBaseInfo & AccountInfo): TransactionDetailExt {
        switch (_.random(5)) {
            case 0: return this.generateDoneTransaction(account)
            case 1: return this.generatePendingTransaction(account)
            case 2: return this.generateRejectedTransaction(account)
            case 3: return this.generateScheduledTransaction(account)
            case 4: return this.generateCancelledTransaction(account)
            case 5: return this.generateHold(account)
        }
        return null
    }

    private generateAccountHolderType(): AccountHolderType {
        return this.pick(['individual', 'corporation'] as AccountHolderType[])
    }

    private generateAmount(max: number = 10000): string {
        return `${_.random(max)}.${this.randomDigits(2)}`
    }

    private randomDigits(count: number): string {
        return _.range(count).map(() => _.random(9).toString()).join('')
    }

    public generateAccountNumber(): string {
        return 'PL' + this.randomDigits(26)
    }

    private generateAccountType(): DictionaryItem {
        return this.pick(this.reference.accountTypes)
    }

    private generateAccountNameClient(): string {
        return this.pick(this.reference.accountNamesClient)
    }

    private generateCurrency(): string {
        return this.pick(this.reference.currencies)
    }

    private generateName(accountHolderType: AccountHolderType): string {
        return accountHolderType === 'individual' ?
            this.pick(this.reference.namesIndividual) : this.pick(this.reference.namesCorporation)
    }

    private pick<T>(source: T[]): T {
        return source && source[_.random(source.length - 1)]
    }

    private generateLocationPrefix(): string {
        return this.pick(this.reference.locationPrefixes)
    }
    private generateLocation(): string {
        return this.pick(this.reference.locations)
    }
    private generateLocationNumber(): string {
        if (_.random(2)) {
            return `${_.random(1, 1000).toString()} / ${_.random(1, 100).toString()}`
        } else {
            return _.random(1, 1000).toString()
        }
    }
    private generateZipCode(): string {
        return `${this.randomDigits(2)}-${this.randomDigits(3)}`
    }
    private generateCity(): string {
        return this.pick(this.reference.cities)
    }
    private generateCountry(): string {
        return this.pick(this.reference.countries)
    }

    private generateNameAddress(accountHolderType: AccountHolderType): NameAddress {
        return {value: [this.generateName(accountHolderType), ...this.generateAddress()]}
    }

    private generateAddress(): Address {
        return [
            `${this.generateLocationPrefix()} ${this.generateLocation()} ${this.generateLocationNumber()}`,
            `${this.generateZipCode()} ${this.generateCity()}`,
            this.generateCountry()
        ]
    }

    private generateOwnBank(): Bank {
        return this.pick(this.reference.ownBanks)
    }
}
