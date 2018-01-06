var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    const parserModule = require('../parser/parser');
    const parser = new parserModule();


    app.post('/add-film/', (req, res) => {
        const movie = {
            title: req.headers.title,
            description: req.headers.description,
            image: req.headers.image,
            rating: req.headers.rating,
            tags: req.headers.tags
        };
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
        db.collection("films").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });

    });

    app.get('/parse-user/:id', (req, res) => {
        const id = req.params.id;
        const url = `/user/${id}/votes/list/ord/date/page/1/#list`;
        parser.parse(url, ($, res) => {
            if (!$('.pagesFromTo').length) {
                console.log(res);
                return;
            }

            const totalNum = parseInt($('.pagesFromTo').text().split(' ').slice(-1)[0]);
            const numPage = 200;
            console.log(totalNum);
            for (let i = 0; i <= totalNum / numPage; i++) {
                const url = `/user/${id}/votes/list/ord/date/perpage/200/page/${i}/#list`;

                parser.parse(url, ($) => {
                    let hrefs = [];
                    $('.nameRus a').map(function () {
                        hrefs.push($(this).attr('href'));
                    });
                    db.collection('films').find({
                        url: {$in: hrefs}
                    }).toArray((err, alreadySavedFilms) => {
                        if (!err) {
                            alreadySavedFilms.forEach((film) => {
                                const pos = hrefs.indexOf(film.url);
                                if (pos > -1) {
                                    hrefs.splice(pos, 1);
                                }
                            });
                        }
                        hrefs.forEach((url) => {
                            let info = {url: url, isParsed: false};
                            db.collection('films').insert(info);
                        });
                    });
                });
            }
        })
    });


    app.get('/test/', (req, res) => {
        var url = '/film/startrek-beskonechnost-2016-734349/';
        parser.parse(url, ($) => {
            let info = {};
            info.name = $('.moviename-big').text();
            info.engName = $('span[itemprop="alternativeHeadline"]').text();
            info.image = $('.film-img-box [itemprop="image"]').attr('src');
            info.url = url;
            info.isParsed = true;
            info.rating = parseFloat($('.rating_ball').text());

            db.collection('films').insert(info, (err, result) => {
                if (err) {
                    res.send({'error': 'An error has occurred'});
                } else {
                    res.send(result.ops[0]);
                }
            });
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
        db.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });

    });

};