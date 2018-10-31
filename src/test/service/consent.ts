import {expect} from 'chai'
import 'mocha'
import * as consent from '../../src/service/consent'

describe('service', function() {
    describe('consent', function() {
        const psuId = 'psuId'
        const scope = 'scope'
        const consentId = 'consentId'
        const scopeDetails = {consentId}
        const tppId = 'tppId'
        describe('post', function() {
            it('should return id', function() {
                expect(consent.post({psuId, scope, scope_details: scopeDetails, tppId})).to.be.not.empty
            })
        })
    })
})
