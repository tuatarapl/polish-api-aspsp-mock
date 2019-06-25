import { Router } from 'express'
import * as fs from 'fs'
import * as jws from 'jws'
import * as moment from 'moment'

const router = Router()
export default router

const verify = function(req, res) {
    const detachedSignature = req.headers['x-jws-signature']
    if (!detachedSignature) {
        console.error('detachedSignature is falsy')
        res.status(401).send({
            responseHeader: {
                requestId: req.headers.requestId,
                sendDate: moment().toISOString(),
                isCallback: true
            },
            code: 'INCORRECT_SIGNATURE',
            message: 'Signature is empty.'
        })
        return 'NO'
    }
    console.log('Verify - Detached signature: ' + detachedSignature)
    console.log('Verify - req.rawBody: ' + req.rawBody)
    console.log('Verify - typeOf(req.rawBody): ' + typeof (req.rawBody))
    const signature = detachedSignature.replace('..', `.${new Buffer(req.rawBody, 'utf8').toString('base64').split('=')[0]}.`)
    console.log('Verify - Signature: ' + signature)
    const tppId = req.headers['tpp-id']
    console.log('Request headers: ' + JSON.stringify(req.headers))
    if (tppId == null) {
        console.error('tpp id not found')
        res.status(401).send({
            responseHeader: {
                requestId: req.headers.requestId,
                sendDate: moment().toISOString(),
                isCallback: true
            },
            code: 'TPP_ID_NOT_FOUND',
            message: 'Tpp id not found.'
        })
        return 'NO'
    }

    let fileStream
    try {
        fileStream = fs.readFileSync(__dirname + '/../../crypto/' + tppId + '.cer')
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found!')
            res.status(401).send({
                responseHeader: {
                    requestId: req.headers.requestId,
                    sendDate: moment().toISOString(),
                    isCallback: true
                },
                code: 'CERIFICATE_NOT_FOUND',
                message: 'Certificate for tpp not found.'
            })
            return 'NO'
        } else {
            throw err
        }
    }
    console.log('Verify - ' + tppId + '.cer: ' + fileStream)

    if (!jws.verify(signature, 'RS256', fileStream)) {
        console.error('certificates are not same')
        res.status(401).send({
            responseHeader: {
                requestId: req.headers.requestId,
                sendDate: moment().toISOString(),
                isCallback: true
            },
            code: 'CERTIFICATES_NOT_SAME',
            message: 'There are various certificates.'
        })
        return 'NO'
    }
    console.log('Verify - jws.verify' + tppId + '.cer: ' + fileStream)
    console.log('Verify - END OF VERIFY')
    return 'OK'
}

router.post('/verify', (req, res) => {
    res.send(verify(req, res))
})

router.use(verify)
