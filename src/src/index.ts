/* istanbul ignore file */
import * as debug from 'debug'
import * as express from 'express'
import { cwd } from 'process'
import consent from './consent'
import './loader'
import polishApi from './polish-api'
import { security } from './security'
import {Consent} from './service/consent'
import { TokenData} from './service/token'
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
app.use(polishApi)

app.use(express.static('web/dist'))
app.use(express.static('static'))
app.get('*', (req, res) => {
    res.sendFile(`${cwd()}/static/index.html`)
})

app.listen(port, () => trace(`Statement service mock listening on port ${port}!`))
