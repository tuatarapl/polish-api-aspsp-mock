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
        const redirectUri = 'redirectUri'
        const state = 'state'
        const consent: service.Consent = {
            psuId, scope, scope_details: scopeDetails, tppId, redirectUri, state, status: 'active'
        }
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
                service.post(consent)
                const id = 'unknown'
                expect(service.get(id)).to.be.undefined
            })
        })
        describe('findByByTppIdAndConsentId', function() {
            it('should return consent by id', function() {
                service.post(consent)
                expect(service.findByByTppIdAndConsentId(tppId, consentId)).to.be.equals(consent)
            })
            it('should return undefined for unknown tppId', function() {
                service.post(consent)
                expect(service.findByByTppIdAndConsentId('unknown', consentId)).to.be.undefined
            })
            it('should return undefined for unknown consentId', function() {
                service.post(consent)
                expect(service.findByByTppIdAndConsentId(tppId, 'unknown')).to.be.undefined
            })
        })
        describe('put', function() {
            it('should create consent', function() {
                const id = 'id'
                service.put(id, {...consent, tppId: 'newTppId'})
                expect(service.get(id)).to.be.deep.equals({...consent, id, tppId: 'newTppId'})
            })
            it('should change consent', function() {
                const id = service.post(consent)
                const newScope = 'newScope'
                service.put(id, {...consent, scope: newScope})
                expect(service.get(id)).to.be.deep.equals({...consent, scope: newScope})
            })
            it('should update findByByTppIdAndConsentId index', function() {
                const id = service.post(consent)
                const newScope = 'newScope'
                service.put(id, {...consent, scope: newScope})
                expect(service.findByByTppIdAndConsentId(tppId, consentId))
                    .to.be.deep.equals({...consent, scope: newScope})
            })
        })
        describe('deleteConsent', function() {
            it('should delete', function() {
                service.post(consent)
                expect(service.deleteConsent(tppId, consentId)).to.be.true
            })
            it('should mark consent as deleted', function() {
                service.post(consent)
                service.deleteConsent(tppId, consentId)
                expect(consent).to.have.property('status', 'deleted')
            })
            it('should return false for unknown tppId', function() {
                service.post(consent)
                expect(service.deleteConsent('unknown', consentId)).to.be.false
            })
            it('should return false for unknown consentId', function() {
                service.post(consent)
                expect(service.deleteConsent(tppId, 'unknown')).to.be.false
            })
        })
    })
})
