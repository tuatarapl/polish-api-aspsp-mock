import {expect} from 'chai'
import 'mocha'
import * as service from '../../src/service/token'

describe('service', function() {
    describe('token', function() {
        describe('generateAccessCode and lookupAccessCode', function() {
            const token = 'token'
            it('should generate access code', function() {
                expect(service.generateAccessCode(token)).to.be.not.empty
            })
            it('should generate resolvable access code', function() {
                const accessCode = service.generateAccessCode(token)
                expect(service.lookupAccessCode(accessCode)).to.be.equals(token)
            })
        })
        describe('generateAccessCode and lookupAccessCode', function() {
            const tokenData = {sub: 'sub'}
            it('should generate token code', function() {
                expect(service.generateToken(tokenData)).to.be.not.empty
            })
            it('should generate resolvable token', function() {
                const token = service.generateToken(tokenData)
                expect(service.lookupToken(token)).to.be.equals(tokenData)
            })
        })
    })
})
