import { Router } from 'express';
import * as moment from 'moment';
const router = Router();
export default router;

const jws = require('jws');
const fs = require('fs');

const verify = function (req, res, next) {
    let detachedSignature = req.headers['x-jws-signature'];
    console.log("detachedSignature: " + detachedSignature);
    if (!detachedSignature) {
        console.error("detachedSignature is falsy");
        res.status(401).send({
            "responseHeader": {
                "requestId": req.headers.requestId,
                "sendDate": moment().toISOString(),
                "isCallback": true
            },
            "code": "INCORRECT_DETACHED_SIGNATURE",
            "message": "Detached signature is empty."
        })
        return;
    }

    let signature = detachedSignature.replace('..', '..', `.${new Buffer(req.raw, 'utf8').toString('base64').split('=')[0]}.`);
    if (jws.verify(signature, "RS256", fs.readFileSync(__dirname + '/../../crypto/tpp.cer'))) {
        console.error("certificates are not same")
        res.status(401).send({
            "responseHeader": {
                "requestId": req.headers.requestId,
                "sendDate": moment().toISOString(),
                "isCallback": true
            },
            "code": "CERTIFICATES_NOT_SAME",
            "message": "There are various certificates."
        })
        return;
    }
    next();
}

router.use(verify);