// server.js
'use strict';

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db = require('../config/db.js');
var app = express();
var port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, function (err, database) {
    if (err) return console.log(err);
    require('../app/routes')(app, database);
    app.listen(port, function () {});
});
//# sourceMappingURL=server.js.map