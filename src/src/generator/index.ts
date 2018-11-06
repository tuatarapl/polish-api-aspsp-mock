import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as _ from 'lodash'
import { AccountBaseInfo, AccountHolderType, AccountInfo, Address,
    Bank, DictionaryItem, NameAddress } from '../service/model'
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
