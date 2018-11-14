import * as _ from 'lodash'
import { AccountBaseInfo, AccountInfo } from './model'

export interface Accounts {
    [user: string]: {
        [accountNumber: string]: AccountBaseInfo & AccountInfo
    }
}
let accounts: Accounts = {}

export function getAccounts(user: string): AccountBaseInfo[] {
    return _(accounts[user]).values()
        .map(({accountNumber, accountTypeName, accountType}) => ({accountNumber, accountTypeName, accountType})).value()
}
export function getAccount(user: string, accountNumber: string): AccountInfo {
    const account = (accounts[user] || {}) [accountNumber]
    if (account) {
        const {
            nameAddress,
            accountType,
            accountTypeName,
            accountHolderType,
            accountNameClient,
            currency,
            availableBalance,
            bookingBalance,
            bank,
            auxData
        } = account
        return {
            accountNumber,
            nameAddress,
            accountType,
            accountTypeName,
            accountHolderType,
            accountNameClient,
            currency,
            availableBalance,
            bookingBalance,
            bank,
            auxData
        }
    }
    return (accounts[user] || {}) [accountNumber]
}

export function setupAccounts(newAccounts: Accounts) {
    accounts = newAccounts
}

export function list(user: string): Array<AccountBaseInfo & AccountInfo> {
    return _(accounts[user]).values().value()
}

export function get(user: string, accountNumber: string): AccountBaseInfo & AccountInfo {
    return (accounts[user] || {})[accountNumber]
}
