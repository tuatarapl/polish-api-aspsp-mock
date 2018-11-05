import {expect} from 'chai'
import 'mocha'
import * as service from '../../src/service/accounts'
import { AccountBaseInfo, AccountInfo } from '../../src/service/model'

describe('service', function() {
    describe('accounts', function() {
        const user = 'user'
        const accountNumber = 'accountNumber'
        const accountNumber2 = 'accountNumber2'
        const availableBalance = 'availableBalance'
        const bicOrSwift = 'bicOrSwift'
        const bookingBalance = 'bookingBalance'
        const currency = 'currency'
        const accountHolderType = 'individual'
        const accountTypeName = 'accountTypeName'
        const code = 'code'
        const description = 'description'
        const name = 'name'
        const account: AccountBaseInfo & AccountInfo = {
            availableBalance,
            bank: {
                address: [],
                bicOrSwift,
                name
            },
            bookingBalance,
            currency,
            nameAddress: {
                value: []
            },
            accountNumber,
            accountHolderType,
            accountType: {
                code,
                description
            },
            accountTypeName,
            auxData: {}
        }
        service.setupAccounts({
            [user]: {
                [accountNumber]: {...account},
                [accountNumber2]: {...account, accountNumber: accountNumber2}
            }
        })
        describe('getAccount', function() {
            it('should get account', function() {
                expect(service.getAccount(user, accountNumber)).to.be.deep.equals(account)
            })
            it('should reject invalid user', function() {
                expect(service.getAccount(`!${user}`, accountNumber)).to.be.undefined
            })
            it('should reject invalid accountNumber', function() {
                expect(service.getAccount(user, `!${accountNumber}`)).to.be.undefined
            })
        })
        describe('getAccounts', function() {
            it('should get account', function() {
                expect(service.getAccounts(user))
                    .to.be.deep.equals([{...account}, {...account, accountNumber: accountNumber2}])
            })
            it('should reject invalid user', function() {
                expect(service.getAccounts(`!${user}`)).to.be.deep.equals([])
            })
        })
    })
})
