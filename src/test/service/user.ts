import {expect} from 'chai'
import 'mocha'
import * as service from '../../src/service/user'

describe('service', function() {
    describe('user', function() {
        describe('logIn', function() {
            const username = 'username'
            const password = 'password'
            service.setupUsers({
                [username]: {
                    username,
                    password
                }
            })
            it('should log in', function() {
                expect(service.logIn(username, password)).to.be.true
            })
            it('should reject invalid user', function() {
                expect(service.logIn(`!${username}`, password)).to.be.false
            })
            it('should reject invalid password', function() {
                expect(service.logIn(username, `!${password}`)).to.be.false
            })
        })
    })
})
