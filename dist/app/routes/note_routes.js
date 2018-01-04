'use strict';

var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {

    app.post('/add-film/', function (req, res) {
        var movie = { title: req.headers.title, description: req.headers.description, image: req.headers.image, rating: req.headers.rating, tags: req.headers.tags };
        db.collection('films').insert(movie, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/films/:id', function (req, res) {
        var id = req.params.id;
        var details = { '_id': new ObjectID(id) };
        db.collection('films').findOne(details, function (err, item) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    });

    app.get('/films/', function (req, res) {
        db.collection("films").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });
    });

    app.get('/users/:id', function (req, res) {
        var id = req.params.id;
        var details = { '_id': new ObjectID(id) };
        db.collection('users').findOne(details, function (err, item) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    });

    app.post('/add-user/', function (req, res) {
        var user = { title: req.headers.title, movie: req.headers.description, rating: req.headers.rating };
        db.collection('films').insert(user, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/users/', function (req, res) {
        db.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });
    });
};
//# sourceMappingURL=note_routes.js.map