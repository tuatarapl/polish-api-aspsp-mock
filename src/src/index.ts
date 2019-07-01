/* istanbul ignore file */
import * as debug from 'debug'
import * as express from 'express'
import * as https from 'https'
import * as fs from 'fs'
import consent from './consent'
import data from './data'
import './loader'
import polishApi from './polish-api'
import { security } from './security'
import web from './web'

const trace = debug('aspsp-mock')
const port = process.env.LISTEN_PORT || 3000
const app = express()

app.use(security)
app.use('/api', consent)
app.use('/data', data)
app.use(polishApi)
app.use(web)

https.createServer({
    key: fs.readFileSync(__dirname + '/../src/crypto/ssl/localhost.key').toString(),
    cert: fs.readFileSync(__dirname + '/../src/crypto/ssl/localhost.crt').toString(),
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
    honorCipherOrder: true,
    secureProtocol: 'TLSv1_2_method'
}, app).listen(port, () => trace(`Statement service mock listening on port ${port}!`))
