import * as bodyParser from 'body-parser'
import {Request, Router} from 'express'
import * as session from 'express-session'
import * as passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import * as FileStore from 'session-file-store'
import {get as getConsent} from './service/consent'
import { lookupToken } from './service/token'
import { logIn } from './service/user'
export const security = Router()
security.use(session({
    name: 'aspsp-session',
    secret: 'keyboard cat',
    store: new (FileStore(session))({
        secret: 'keyboard cat'
    })
}))
security.use(passport.initialize())
security.use(passport.session())

passport.use(new LocalStrategy((username, password, done) => {
    if (logIn(username, password)) {
        done(null, {username})
    } else {
        done(new Error('login failed'))
    }
}))

export const authenticate = (req, res, next) => req.user ? next() : res.status(401).send()

security.get('/user', authenticate, (req, res) => res.send(req.user))

security.use(bodyParser.urlencoded({
    extended: true
}))

security.use(bodyParser.json())

security.post('/login', passport.authenticate('local', {}), (req, res) => res.send(req.user))

passport.serializeUser<any, string>((user, done) => {
    done(null, user.username)
})

passport.deserializeUser<any, string>((id, done) => {
    done(null, {
        username: id
    })
})

security.use((req: Request, res, next) => {
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
