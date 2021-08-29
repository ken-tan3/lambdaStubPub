const express = require('express');
const app = express();

const router = require('./routes/router');

app.use('/api/v1', router);

module.exports = app;