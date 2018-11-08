import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as  _ from 'lodash'
import { setupAccounts } from './service/accounts'
import { setupTransactions } from './service/transactions'
import { setupUsers } from './service/user'
const users = _.keyBy(yaml.safeLoadAll(fs.readFileSync('data/data.yaml', 'UTF-8')), 'username' )
setupUsers(_(users).mapValues(({username, password}) => ({username, password})).value())
const accountsData = _(users).mapValues(({accounts}) => _.keyBy(accounts, 'accountNumber')).value()
setupAccounts(accountsData)
const transactionsData = _(users).mapValues(({accounts}) =>
    _(accounts).keyBy('accountNumber').mapValues(({transactions}) => _.keyBy(transactions, 'baseInfo.itemId')).value())
    .value()
setupTransactions(transactionsData)
