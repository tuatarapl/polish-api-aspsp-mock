const express = require('express');
const app = express();
export default app;

const jws = require('jws');
const fs = require('fs');

var signTest = function (res) {
    console.log('SignTest - res.body: ' + res.body);
    var payload = jws.sign({
        header: { alg: 'RS256' },
        payload: res.body,
        secret: fs.readFileSync(__dirname + "/../../crypto/aspsp.key"),
    }).replace(/\..*\./, '..');
    console.log('SignTest - payload: ' + payload);
    res.body = payload;
    return payload;
}

app.get("/sign", function (req, res) {
    let v = { body: { "test": "123" } };
    res.send(signTest(v));
});

function sign(data) {
    console.log('Sign - sign: ' + data);
    return jws.sign({
        header: { alg: 'RS256' },
        payload: data,
        secret: fs.readFileSync(__dirname + "/../../crypto/aspsp.key"),
    }).replace(/\..*\./, '..');
}

function responseInterceptor(req, res, next) {
    var originalSend = res.send;
    res.send = function () {
        if (arguments[0] != null) {
            arguments[0] = JSON.stringify(arguments[0]);
            res.set({
                'x-jws-signature': sign(arguments[0]),
                'content-type': 'application/json'
            })
        }
        originalSend.apply(res, arguments);
    };
    next();
}

app.use(responseInterceptor);