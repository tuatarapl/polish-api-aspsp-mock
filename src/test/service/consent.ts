import {expect} from 'chai'
import 'mocha'
import * as service from '../../src/service/consent'

describe('service', function() {
    describe('consent', function() {
        const psuId = 'psuId'
        const scope = 'scope'
        const consentId = 'consentId'
        const scopeDetails = {consentId}
        const tppId = 'tppId'
        const consent = {psuId, scope, scope_details: scopeDetails, tppId}
        describe('post', function() {
            it('should return id', function() {
                expect(service.post(consent)).to.be.not.empty
            })
        })
        describe('get', function() {
            it('should return consent by id', function() {
                const id = service.post(consent)
                expect(service.get(id)).to.be.equals(consent)
            })
            it('should return undefined for unknown id', function() {
                const id = 'unknown'
                expect(service.get(id)).to.be.undefined
            })
        })
        describe('findByByTppIdAndConsentId', function() {
            it('should return consent by id', function() {
                const id = service.post(consent)
                expect(service.findByByTppIdAndConsentId(tppId, consentId)).to.be.equals(consent)
            })
            it('should return undefined for unknown tppId', function() {
                const id = 'unknown'
                expect(service.findByByTppIdAndConsentId('unknown', consentId)).to.be.undefined
            })
            it('should return undefined for unknown consentId', function() {
                const id = 'unknown'
                expect(service.findByByTppIdAndConsentId(tppId, 'unknown')).to.be.undefined
            })
        })
    })
})
