import { Router } from 'express'
import * as fs from 'fs'
import * as jws from 'jws'
import * as moment from 'moment'

const router = Router()
export default router

const verify = (req, res, next) => {
    const detachedSignature = req.headers['x-jws-signature']
    if (!detachedSignature) {
        res.status(401).send({
            responseHeader: {
                requestId: req.headers.requestId,
                sendDate: moment().toISOString(),
                isCallback: true
            },
            code: 'INCORRECT_SIGNATURE',
            message: 'Signature is empty.'
        })
        return
    }
    const signature = detachedSignature.replace('..', `.${new Buffer(req.rawBody, 'utf8').toString('base64').split('=')[0]}.`)
    const tppId = req.headers['x-jws-tpp-id']
    if (tppId === null || tppId === undefined) {
        res.status(401).send({
            responseHeader: {
                requestId: req.headers.requestId,
                sendDate: moment().toISOString(),
                isCallback: true
            },
            code: 'TPP_ID_NOT_FOUND',
            message: 'Tpp id not found.'
        })
        return
    }
    let fileStream
    try {
        fileStream = fs.readFileSync(__dirname + `/../../crypto/${tppId}.cer`)
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.status(401).send({
                responseHeader: {
                    requestId: req.headers.requestId,
                    sendDate: moment().toISOString(),
                    isCallback: true
                },
                code: 'CERIFICATE_NOT_FOUND',
                message: 'Certificate for tpp not found.'
            })
        } else {
            res.status(401).send({
                responseHeader: {
                    requestId: req.headers.requestId,
                    sendDate: moment().toISOString(),
                    isCallback: true
                },
                code: 'ERROR_READING_FILE',
                message: 'Problem with reading file.'
            })
        }
        return
    }
    if (!jws.verify(signature, 'RS256', fileStream)) {
        res.status(401).send({
            responseHeader: {
                requestId: req.headers.requestId,
                sendDate: moment().toISOString(),
                isCallback: true
            },
            code: 'CERTIFICATES_NOT_SAME',
            message: 'There are various certificates.'
        })
        return
    }
    next()
}

router.use(verify)
