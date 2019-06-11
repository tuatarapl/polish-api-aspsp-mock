import { Router } from 'express';

const router = Router();
export default router;

const jws = require('jws');
const fs = require('fs');
const expect = require('chai').use(require('chai-subset')).expect;

var sign = function (req, res, next) {
    var payload = jws.sign({
        header: { alg: 'HS256' },
        payload: req.body,
        secret: fs.readFileSync(__dirname + "/../../crypto/tpp.cer"),
    }).replace(/\..*\./, '..');
    req.body = payload;
    next();
}

const verify = function (req, res, next) {
    let detachedSignature = res.headers['x-jws-signature'];
    expect(detachedSignature).to.not.be.a('null');
    expect(detachedSignature).to.not.be.an('undefined');
    let signature = detachedSignature.replace('..', '..', `.${new Buffer(res.raw, 'utf8').toString('base64').split('=')[0]}.`);
    expect(jws.verify(signature, "RS256"), fs.readFileSync(fs.readFileSync(__dirname + '/../../crypto/tpp.cer')));
    const signatureFlag = res.headers['x-jws-signature-ok']
    expect(signatureFlag).to.be.equals('true')
    next();
}

router.use(sign);
router.use(verify);
