/* istanbul ignore file */
import * as basicAuth from 'basic-auth'
import * as debug from 'debug'
import * as express from 'express'
import { NextFunction, Request, Response} from 'express'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'
import { cwd } from 'process'
import * as swagger from 'swagger-tools'
import consent from './consent'
import './loader'
import { security } from './security'
import {Consent, get as getConsent, put as putConsent} from './service/consent'
import {generateAccessCode, generateToken, lookupToken, TokenData} from './service/token'
const trace = debug('aspsp-mock')
const port = process.env.LISTEN_PORT || 3000
const app = express()

app.use(security)
app.use(consent)
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

const polishAPISpecification = yaml.safeLoad(fs.readFileSync('api/PolishAPI-ver2_1.yaml', 'UTF-8'))
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

app.use(express.static('web/dist'))
app.use(express.static('static'))
app.get('*', (req, res) => {
    res.sendFile(`${cwd()}/static/index.html`)
})

app.listen(port, () => trace(`Statement service mock listening on port ${port}!`))
