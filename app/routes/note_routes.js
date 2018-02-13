var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    const parserModule = require('../parser/parser');
    const ParserApi = require('../parser/api');
    const parser = new parserModule();
    const parserApi = new ParserApi();
    const REQUEST_DELAY = 75000;

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    console.log(parserApi);

    app.post('/add-film/', parserApi.film.add(app, db));
    app.get('/films/:id', parserApi.film.byId(app, db));
    app.get('/films/', parserApi.film.list(app, db));


    app.post('/film/', (req, res) => {
        db
            .collection('films')
            .aggregate([
                { $match: { isParsed: true} },
                { $sample: { size: 1 } },
            ])
            .toArray(function (err, result) {
                if (err) throw err;
                res.send(result.pop());
                console.log(result);
                // db.close();
            });
    });

    app.get('/settings/', (req, res) => {
        db.collection("settings").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            // db.cl`ose();
        });

    });

    app.get('/clear/', (req, res) => {

        db.collection("votesTasks").deleteMany({}, function (err, result) {});
        db.collection("users").deleteMany({}, function (err, result) {});
        db.collection("films").deleteMany({}, function (err, result) {});

        db.collection("settings").deleteMany({}, function (err, result) {
            db.collection("settings").insert({name: 'nextUser', value: 1}, function (err, result) {
                console.log('end');
            });
        });
    });

    app.get('/votes/', (req, res) => {
        db.collection("votesTasks").find().toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            // db.close();
        });
    });

    app.get('/parse-votes/', parser.parseVotes(app, db));
    app.get('/parse-user/:id', parser.parseUser(app, db));
    app.get('/parse-film/', parser.parseFilm(app, db));
    app.get('/parse-next-user/', parser.parseNextUser(app, db));

    app.get('/users/:id',  parserApi.user.byId(app, db));
    app.post('/add-user/',  parserApi.user.add(app, db));
    app.get('/users/',  parserApi.user.list(app, db));
};