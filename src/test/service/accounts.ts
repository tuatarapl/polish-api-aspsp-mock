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
        const name = 'name'
        const bank = {
            address: [],
            bicOrSwift,
            name
        }
        const bookingBalance = 'bookingBalance'
        const currency = 'currency'
        const nameAddress = {
            value: []
        }
        const accountHolderType = 'individual'
        const accountNameClient = 'accountNameClient'
        const accountTypeName = 'accountTypeName'
        const code = 'code'
        const description = 'description'
        const accountType = {
            code,
            description
        }
        const auxData = {}
        const account: AccountBaseInfo & AccountInfo = {
            availableBalance,
            bank,
            bookingBalance,
            currency,
            nameAddress,
            accountNumber,
            accountHolderType,
            accountNameClient,
            accountType,
            accountTypeName,
            auxData
        }
        service.setupAccounts({
            [user]: {
                [accountNumber]: {...account},
                [accountNumber2]: {...account, accountNumber: accountNumber2}
            }
        })
        describe('getAccount', function() {
            it('should get account', function() {
                expect(service.getAccount(user, accountNumber)).to.be.deep.equals({
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
                })
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
                    .to.be.deep.equals([{accountNumber, accountTypeName, accountType},
                        {accountNumber: accountNumber2, accountTypeName, accountType}])
            })
            it('should reject invalid user', function() {
                expect(service.getAccounts(`!${user}`)).to.be.deep.equals([])
            })
        })
    })
})
