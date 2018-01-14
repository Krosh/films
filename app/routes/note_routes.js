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
        db.collection("films").find({isParsed: true}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });

    });

    app.get('/votes/', (req, res) => {
        db.collection("votesTasks").find().toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            db.close();
        });
    });

    app.get('/parse-votes/', (req, res) => {
        db.collection('votesTasks').findOne({
            isParsed: false
        }, (err, item) => {
            let url = item.url;
            db.collection('votesTasks').update({
                url: url
            }, {url: url, isParsed: true}, (err, item) => {
                console.log(err);
            });

            if (err) {
                return;
            }

            parser.parse(url, ($, res) => {
                let hrefs = [];
                if (!$('.profileFilmsList .item').length) {
                    return;
                }

                $('.profileFilmsList .item').map(function () {
                    const $a = $(this).find('a');
                    hrefs.push($a.attr('href'));

                    const mark = {
                        idUser: item.idUser,
                        rating: $(this).find('.vote').text(),
                        film: $a.attr('href'),
                    };
                    console.log(mark);

                    db.collection('users').find(mark)
                        .toArray((err, data) => {
                            console.log(err);
                            if (err) {
                                console.log('insert');
                                db.collection('users').insert(mark);
                            }
                        });
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

                db.collection('votesTasks').update({
                    url: url
                }, {url: url, isParsed: true}, (err, item) => {
                });
            });
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
            for (let i = 0; i <= totalNum / numPage; i++) {
                const url = `/user/${id}/votes/list/ord/date/perpage/200/page/${i}/#list`;

                const votesTask = {
                    isParsed: false,
                    idUser: id,
                    url: url,
                };

                db.collection('votesTasks').insert(votesTask, (err, res) => {
                    console.log(err);return;
                });
            }
        })
    });


    app.get('/parse-film/', (req, res) => {
        setInterval(function () {
            db.collection('films').findOne({
                isParsed: false
            }, (err, item) => {
                if (err) {
                    return;
                }

                let url = item.url;

                parser.parse(url, ($) => {
                    let info = {};
                    info.name = $('.moviename-big').text();
                    if (info.name == '') {
                        console.log('has captcha')
                        return;
                    }
                    info.engName = $('span[itemprop="alternativeHeadline"]').text();
                    info.image = $('.film-img-box [itemprop="image"]').attr('src');
                    info.url = url;
                    info.isParsed = true;
                    info.rating = parseFloat($('.rating_ball').text());

                    db.collection('films').update({url: url}, info, (err, result) => {
                        if (err) {
                            res.send({'error': 'An error has occurred'});
                        } else {
                            res.send(result.ops);
                        }
                    });
                })

            }, 30000)
        });
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