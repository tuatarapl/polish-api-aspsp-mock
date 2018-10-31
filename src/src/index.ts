/* istanbul ignore file */
import * as basicAuth from 'basic-auth'
import * as debug from 'debug'
import * as express from 'express'
import { NextFunction, Request, Response} from 'express'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as swagger from 'swagger-tools'
import {Consent, get as getConsent, put as putConsent} from './service/consent'
import {generateAccessCode,generateToken} from './service/token'
const trace = debug('aspsp-mock')
const port = process.env.LISTEN_PORT || 3000
const app = express()
const polishAPISpecification = yaml.safeLoad(fs.readFileSync('api/PolishAPI-ver2_1.yaml', 'UTF-8'))

app.get('/confirmConsent', (req, res) => {
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
                const token = generateToken({consentId: id})
                trace(`token ${token}`)
                const accessCode = generateAccessCode(token)
                trace(`accessCode ${accessCode}`)
                const redirectUri = new URL(consent.redirectUri)
                redirectUri.searchParams.append('code', accessCode)
                redirectUri.searchParams.append('state', consent.state)
                res.redirect(redirectUri.toString())
            } else {
                const redirectUri = new URL(consent.redirectUri)
                redirectUri.searchParams.append('error', 'Not yet implemented')
                res.redirect(redirectUri.toString())
            }
        } else {
            res.status(500).send()
        }
    } else {
        res.status(400).send()
    }
})

swagger.initializeMiddleware(polishAPISpecification, (middleware) => {
  app.use(middleware.swaggerMetadata())
  app.use(middleware.swaggerValidator({
    validateResponse: false
  }))
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send(err.results || err)
  })
  app.use(middleware.swaggerRouter({useStubs: true, controllers: path.join(__dirname, 'controllers')}))
  app.use(middleware.swaggerUi())
})


app.listen(port, () => trace(`Statement service mock listening on port ${port}!`))
