import { Router } from 'express'
import * as fs from 'fs'
import * as jws from 'jws'
import * as moment from 'moment'

const router = Router()
export default router

const verify = (req, res, next) => {
    const detachedSignature = req.headers['x-jws-signature']
    const tppId = req.headers['x-jws-tpp-id']
    if (detachedSignature) {
        if (tppId) {
            const signature = detachedSignature.replace('..', `.${new Buffer(req.rawBody, 'utf8').toString('base64').split('=')[0]}.`)
            if (isJwsSignatureVerified(req, res, tppId, signature)) {
                next()
            } else {
                return
            }
        } else {
            errorHandler(req, res, 401, 'TPP_ID_NOT_FOUND', 'Tpp id not found.')
            return
        }
    } else {
        errorHandler(req, res, 401, 'INCORRECT_SIGNATURE', 'Signature is empty.')
        return
    }
}

function errorHandler(req, res, status: number, code: string, message: string) {
    res.status(status).send({
        responseHeader: {
            requestId: req.headers['X-REQUEST-ID'],
            sendDate: moment().toISOString(),
            isCallback: true
        },
        code: code,
        message: message
    })
}

function isJwsSignatureVerified(req, res, tppId, signature) {
    try {
        let fileStream = fs.readFileSync(__dirname + `/../../crypto/${tppId}.cer`)
        if (!jws.verify(signature, 'RS256', fileStream)) {
            errorHandler(req, res, 401, 'CERTIFICATES_NOT_SAME', 'There are various certificates.')
            return false;
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            errorHandler(req, res, 401, 'CERIFICATE_NOT_FOUND', 'Certificate for tpp not found.')
        } else {
            errorHandler(req, res, 401, 'ERROR_READING_FILE', 'Problem with reading file.')
        }
        return false
    }
    return true;
}

router.use(verify)
