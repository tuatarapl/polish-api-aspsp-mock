import * as uuid4 from 'uuid/v4'

export interface Consent {
    id?: string
    scope: string
    psuId?: string
    tppId: string
    redirectUri: string
    scope_details: {
        consentId: string
    } & any,
    state: string,
    status: 'active' | 'deleted'
}

const consentById: {[id: string]: Consent} = {

}

const consentByTppIdAndConsentId: {[tppId: string]: {[consentId: string]: Consent}} = {

}

export function post(consent: Consent): string {
    const internalId = uuid4()
    consent.id = internalId
    consentById[internalId] = consent
    consentByTppIdAndConsentId[consent.tppId] = consentByTppIdAndConsentId[consent.tppId] || {}
    consentByTppIdAndConsentId[consent.tppId][consent.scope_details.consentId] = consent
    return internalId
}

export function get(id: string): Consent {
    return consentById[id]
}

export function findByByTppIdAndConsentId(tppId: string, consentId: string): Consent {
    return (consentByTppIdAndConsentId[tppId] || {} )[consentId]
}

export function put(id: string, consent: Consent) {
    consent.id = id
    consentById[id] = consent
    consentByTppIdAndConsentId[consent.tppId] = consentByTppIdAndConsentId[consent.tppId] || {}
    consentByTppIdAndConsentId[consent.tppId][consent.scope_details.consentId] = consent
}

export function deleteConsent(tppId: string, consentId: string): boolean {
    const consent = findByByTppIdAndConsentId(tppId, consentId)
    if (consent) {
        consent.status = 'deleted'
        return true
    } else {
        return false
    }
}
