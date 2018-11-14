import * as basicAuth from 'basic-auth'
import * as debug from 'debug'
import {json, Router} from 'express'
import { NextFunction, Request, Response} from 'express'
import * as _ from 'lodash'
import {Consent, get as getConsent, listAll, listByPsuId, put as putConsent} from './service/consent'
import {generateAccessCode, generateToken, lookupToken, TokenData} from './service/token'

declare global {
    namespace Express {
        interface Request {
            token: string
            tokenData: TokenData
            consentId: string
            consent: Consent
        }
    }
}

const trace = debug('aspsp-mock:consent')
const router = Router()
export default router

router.get('/confirmConsent', (req, res) => {
    trace('GET /confirmConsent')
    const id = req.query.consentId
    trace(`consentId ${id}`)
    if (id) {
        const consent = getConsent(id)
        trace(`consent ${JSON.stringify(consent)}`)
        if (consent) {
            const auth = basicAuth(req)
            trace(`auth ${auth}`)
            if (auth) {
                consent.psuId = auth.name
                putConsent(id, consent)
                const token = generateToken({
                    sub: auth.name,
                    consentId: id
                })
                trace(`token ${token}`)
                const accessCode = generateAccessCode(token)
                trace(`accessCode ${accessCode}`)
                redirect(req, res, consent.redirectUri, {
                    code: accessCode,
                    state : consent.state
                })
            } else {
                res.redirect(`/confirmation/${id}`)
            }
        } else {
            res.status(500).send()
        }
    } else {
        res.status(400).send()
    }
})

function getUsername(req): string {
    const auth = basicAuth(req)
    trace(`auth ${auth}`)
    if (auth) {
        return auth.name
    } else if (req.user) {
        return req.user.username
    }
}

function redirect(req: Request, res: Response, baseUrl: string, params: {[key: string]: string}) {
    const redirectUrl = new URL(baseUrl)
    _.forEach(params, (value, key) => redirectUrl.searchParams.append(key, value))
    if (req.accepts('application/vnd.tuatara.redirect+json')) {
        res.send({
            baseUrl,
            redirectUrl,
            ...params
        })
    } else {
        res.redirect(redirectUrl.toString())
    }
}

router.post('/confirmConsent', json(), (req, res) => {
    trace('POST /confirmConsent')
    const id = req.query.consentId
    const newConsent: Consent = req.body
    trace(`consentId ${id}`)
    trace(`newConsent ${JSON.stringify(newConsent)}`)
    if (id) {
        const oldConsent = getConsent(id)
        trace(`consent ${JSON.stringify(oldConsent)}`)
        if (oldConsent) {
            const username = getUsername(req)
            if (username) {
                const consent: Consent = {
                    ...oldConsent,
                    psuId: username,
                    scope: newConsent.scope,
                    scope_details: newConsent.scope_details
                }
                putConsent(id, consent)
                const token = generateToken({
                    sub: username,
                    consentId: id
                })
                trace(`token ${token}`)
                const accessCode = generateAccessCode(token)
                trace(`accessCode ${accessCode}`)
                redirect(req, res, consent.redirectUri, {
                    code: accessCode,
                    state : consent.state
                })
            } else {
                res.redirect(`/confirmation/${id}`)
            }
        } else {
            res.status(500).send()
        }
    } else {
        res.status(400).send()
    }
})

router.get('/consent/:consentId', (req, res) => {
    const consent = getConsent(req.params.consentId)
    if (consent) {
        res.send(consent)
    } else {
        res.status(404).send()
    }
})

router.get('/consent/', (req, res) => {
    const consents = listAll()
    if (consents) {
        res.send(consents)
    } else {
        res.status(404).send()
    }
})

router.get('/user/consent/', (req, res) => {
    const consents = listByPsuId(req.user.username)
    if (consents) {
        res.send(consents)
    } else {
        res.status(404).send()
    }
})

router.get('/user/consent/:consentId', (req, res) => {
    const consent = getConsent(req.params.consentId)
    if (consent && consent.psuId === req.user.username) {
        res.send(consent)
    } else {
        res.status(404).send()
    }
})
