var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    const parserModule = require('../parser/parser');
    const parser = new parserModule();
    const REQUEST_DELAY = 60000;


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

        db.collection("votesTasks").deleteMany({}, function (err, result) {

        });
        db.collection("users").deleteMany({}, function (err, result) {

        });

        db.collection("films").deleteMany({}, function (err, result) {

        });

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

    app.get('/parse-votes/', (req, res) => {setInterval(() => {
        db.collection('votesTasks').findOne({
            isParsed: false
        }, (err, item) => {
            if (err) {
                console.log('cannot find votesTask');
                return;
            }

            let url = item.url;
            db.collection('votesTasks').update({
                url: url
            }, {url: url, isParsed: true}, (err, item) => {
                if (err) {
                    console.log('update err');
                }
            });

            parser.parse(url, ($, res) => {
                let hrefs = [];
                if (!$('.profileFilmsList .item').length) {
                    console.log('no profileFilmsList ');
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
                    console.log('Mark', mark);

                    db.collection('users').find(mark)
                        .toArray((err, data) => {
                            if (err) {
                                console.log('insert error');
                            } else {
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
    }, REQUEST_DELAY)});

    let parseUser = function(id, callback) {
        const url = `/user/${id}/votes/list/ord/date/page/1/#list`;
        parser.parse(url, ($, res) => {
            if (!$('.pagesFromTo').length) {
                console.log(res);
                return;
            }

            if (typeof callback !== 'undefined') {
                callback();
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

                db.collection('votesTasks').findOne(votesTask, (err, res) => {
                    console.log('find votesTask', err, res);
                    if (res === null) {
                        db.collection('votesTasks').insert(votesTask, (err, res) => {
                            console.log('insert votesTask', err);
                        });
                    }
                });
            }
        })
    };

    app.get('/parse-user/:id', (req, res) => {
        const id = req.params.id;
        parseUser(id);
    });

    app.get('/parse-film/', (req, res) => {
        console.log('parse film start');
        setInterval(function () {
            console.log('get from db');
            const nonParsed = {
                isParsed: false
            };
            db.collection('films').findOne(nonParsed, (err, item) => {
                console.log('get', err, item);
                if (err) {
                    console.log('cannot find not parsed film');
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
            })
        }, REQUEST_DELAY);
    });

    app.get('/parse-next-user/', (req, res) => {setInterval( () => {
        const SETTING_NAME = 'nextUser';
        const setting = {name: SETTING_NAME};
        db.collection('settings').findOne(setting, (err, item) => {
            let id = item.value + 1;

            parseUser(id, () => {
                db.collection('settings').update({
                    name: SETTING_NAME
                }, {name: SETTING_NAME, value: id}, (err, item) => {
                    if (err) {
                        console.log('update err setting');
                    }
                });
            });
        });
    }, REQUEST_DELAY)});

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
            // db.close();
        });

    });

};