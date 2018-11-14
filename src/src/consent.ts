import * as basicAuth from 'basic-auth'
import * as debug from 'debug'
import {Router} from 'express'
import { NextFunction, Request, Response} from 'express'
import {Consent, get as getConsent, put as putConsent} from './service/consent'
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
    trace('/confirmConsent')
    const id = req.query.consentId
    trace(`consentID ${id}`)
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
                const redirectUri = new URL(consent.redirectUri)
                redirectUri.searchParams.append('code', accessCode)
                redirectUri.searchParams.append('state', consent.state)
                res.redirect(redirectUri.toString())
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

router.use((req: Request, res, next) => {
    if (req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            const token = parts[1]
            const tokenData = lookupToken(token)
            req.token = token
            req.tokenData = tokenData
            if (tokenData.consentId) {
                const consentId = tokenData.consentId
                const consent = getConsent(consentId)
                req.consentId = consentId
                req.consent = consent
            }
        }
    }
    next()
})

router.get('/consent/:consentId', (req, res) => {
    const consent = getConsent(req.params.consentId)
    if (consent) {
        res.send(consent)
    } else {
        res.status(404).send()
    }
})
