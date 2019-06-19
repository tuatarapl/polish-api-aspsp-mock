const express = require('express');
const app = express();
export default app;

const jws = require('jws');
const fs = require('fs');

var signTest = function (res) {
    console.log(res.body);
    var payload = jws.sign({
        header: { alg: 'HS256', type: 'JWT' },
        payload: res.body,
        secret: fs.readFileSync(__dirname + "/../../crypto/aspsp.key"),
    }).replace(/\..*\./, '..');
    console.log(payload);
    res.body = payload;
    return payload;
}

app.get("/sign", function (req, res) {
    let v = { body: { "test": "123" } };
    res.send(signTest(v));
});

function sign(data) {
    console.log(data);
    return jws.sign({
        header: { alg: 'HS256', type: 'JWT' },
        payload: data,
        secret: fs.readFileSync(__dirname + "/../../crypto/aspsp.key"),
    }).replace(/\..*\./, '..');
}

function responseInterceptor(req, res, next) {
    var originalSend = res.send;

    res.send = function () {
        arguments[0] = sign(arguments[0]);
        console.log(arguments[0]);
        originalSend.apply(res, arguments);
    };
    next();
}

app.use(responseInterceptor);