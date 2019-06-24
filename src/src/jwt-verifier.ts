import { Router } from 'express';
import * as moment from 'moment';
import * as jws from 'jws';
import * as fs from 'fs';

const router = Router();
export default router;

const verify = function (req, res) {
    let detachedSignature = req.headers['x-jws-signature'];
    if (!detachedSignature) {
        console.error("detachedSignature is falsy");
        res.status(401).send({
            "responseHeader": {
                "requestId": req.headers.requestId,
                "sendDate": moment().toISOString(),
                "isCallback": true
            },
            "code": "INCORRECT_SIGNATURE",
            "message": "Signature is empty."
        })
        return 'NO';
    }
    console.log('Verify - Detached signature: ' + detachedSignature);
    console.log('Verify - req.rawBody: ' + req.rawBody);
    console.log('Verify - typeOf(req.rawBody): ' + typeof (req.rawBody));
    let signature = detachedSignature.replace('..', `.${new Buffer(req.rawBody, 'utf8').toString('base64').split('=')[0]}.`);
    console.log('Verify - Signature: ' + signature);
    console.log('Verify - aspsp.cer: ' + fs.readFileSync(__dirname + '/../../crypto/aspsp.cer'));
    if (!jws.verify(signature, "HS256", fs.readFileSync(__dirname + '/../../crypto/aspsp.cer'))) {
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
        return 'NO';
    }
    console.log('Verify - jws.verify: ' + jws.verify(detachedSignature, "HS256", fs.readFileSync(__dirname + '/../../crypto/aspsp.cer')));
    console.log('Verify - END OF VERIFY');
    return 'OK';
}

router.post('/verify', (req, res) => {
    res.send(verify(req, res));
});

router.use(verify);