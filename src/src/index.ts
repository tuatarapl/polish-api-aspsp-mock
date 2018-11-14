/* istanbul ignore file */
import * as debug from 'debug'
import * as express from 'express'
import consent from './consent'
import './loader'
import polishApi from './polish-api'
import { security } from './security'
import {Consent} from './service/consent'
import { TokenData} from './service/token'
import web from './web'
const trace = debug('aspsp-mock')
const port = process.env.LISTEN_PORT || 3000
const app = express()

app.use(security)
app.use('/api', consent)
app.use(polishApi)
app.use(web)

app.listen(port, () => trace(`Statement service mock listening on port ${port}!`))
