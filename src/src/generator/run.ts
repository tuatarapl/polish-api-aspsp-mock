import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as _ from 'lodash'
import { Generator } from '.'
import { AccountBaseInfo, AccountInfo, TransactionDetailExt } from '../service/model'
import { User } from '../service/user'

interface UserExt extends User {
    accounts?: Array<AccountBaseInfo & AccountInfo & { transactions?: TransactionDetailExt[]}>
}

const generator = new Generator()

const users: UserExt[] = generator.generateUsers(10)
_.forEach(users, (user) => {
    user.accounts = generator.generateAccounts(_.random(5, 10))
    _.forEach(user.accounts, (account) => {
        account.transactions = generator.generateTransactions(_.random(10, 100), account)
    })
})
fs.writeFileSync('data/data.yaml',
    _.map(users, (user) => yaml.safeDump(user, {skipInvalid: true, noRefs: true})).join('---\n'), 'UTF-8')
