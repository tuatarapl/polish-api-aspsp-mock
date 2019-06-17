import { Router } from 'express';

const router = Router();
export default router;

const jws = require('jws');
const fs = require('fs');

var sign = function (req, res, next) {
    var payload = jws.sign({
        header: { alg: 'HS256' },
        payload: res.body,
        secret: fs.readFileSync(__dirname + "/../../crypto/tpp.cer"),
    }).replace(/\..*\./, '..');
    console.error("1")
    res.body = payload;
    next();
}

const verify = function (req, res, next) {
    let detachedSignature = req.headers['x-jws-signature'];
    if (!detachedSignature) {
        console.error("detachedSignature is falsy")
        next()
        //throw expection;
    }
    console.error(detachedSignature)
    let signature = detachedSignature.replace('..', '..', `.${new Buffer(req.raw, 'utf8').toString('base64').split('=')[0]}.`);
    console.error("signature: " + signature)
    if (jws.verify(signature, "RS256") != fs.readFileSync(__dirname + '/../../crypto/tpp.cer')) {
        console.error("certs are not same")
        next()
        //throw exception
    }
    const signatureFlag = req.headers['x-jws-signature-ok']
    if (!signatureFlag) {
        console.error("signatureFlag theres no signature flag")
        next()
        //throw exception
    }
    next();
}

router.use(sign);
router.use(verify);
