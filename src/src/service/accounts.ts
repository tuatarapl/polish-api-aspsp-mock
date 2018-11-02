import * as _ from 'lodash'
export interface DictionaryItem {
    code: string
    description: string
}
export interface AccountBaseInfo {
    accountNumber:	string
    accountTypeName: string
    accountType: DictionaryItem
}

export interface NameAddress {
    value: string[]
}

export interface Address {
    value: string[]
}

export interface BankAccountInfo {
    bicOrSwift: string
    name: string
    address: Address
}
export interface Map {
    [key: string]: string
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

export interface Accounts {
    [user: string]: {
        [accountNumber: string]: AccountBaseInfo & AccountInfo
    }
}
let accounts: Accounts = {}

export function getAccounts(user: string): AccountBaseInfo[] {
    return _(accounts[user]).values().flatten().value()
}
export function getAccount(user: string, accountNumber: string): AccountInfo {
    return (accounts[user] || {}) [accountNumber]
}

export function setupAccounts(newAccounts: Accounts) {
    accounts = newAccounts
}
