const express = require('express');
const app = express();
export default app;

app.use(function (req, res, next) {
    console.log("RawBody - raw-body.ts")
    req.rawBody = '';

    req.setEncoding('utf8');
    req.on('data', function (chunk) { console.log('RawBody - chunk: ' + chunk); req.rawBody += chunk });
    next();
});