var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    const parserModule = require('../parser/parser');
    const parser = new parserModule();

    app.post('/add-film/', (req, res) => {
        const movie = {title: req.headers.title, description: req.headers.description, image: req.headers.image, rating: req.headers.rating, tags: req.headers.tags};
        db.collection('films').insert(movie, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/films/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('films').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    app.get('/films/', (req, res) => {
        db.collection("films").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });

    });

    app.get('/test/', (req, res) => {
        parser.parse('https://yandex.ru/', (content) => {
            console.log(content);
        })
    });

    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('users').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });


    app.post('/add-user/', (req, res) => {
        const user = {title: req.headers.title, movie: req.headers.description, rating: req.headers.rating};
        db.collection('films').insert(user, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/users/', (req, res) => {
        db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });

    });

};