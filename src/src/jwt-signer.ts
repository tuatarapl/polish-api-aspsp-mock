import * as express from 'express'
import * as fs from 'fs'
import * as jws from 'jws'

const app = express()
export default app

function sign(data) {
    return jws.sign({
        header: { alg: 'RS256' },
        payload: data,
        secret: fs.readFileSync(__dirname + '/../../crypto/jwt/aspsp.key')
    }).replace(/\..*\./, '..')
}

function responseInterceptor(req, res, next) {
    const originalSend = res.send
    res.send = function () {
        if (arguments[0] != null) {
            arguments[0] = JSON.stringify(arguments[0])
            res.set({
                'x-jws-signature': sign(arguments[0]),
                'content-type': 'application/json'
            })
        }
        originalSend.apply(res, arguments)
    }
    next()
}

app.use(responseInterceptor)
