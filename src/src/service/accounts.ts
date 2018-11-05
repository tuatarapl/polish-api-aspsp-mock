import * as _ from 'lodash'
import { AccountBaseInfo, AccountInfo } from './model'

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
