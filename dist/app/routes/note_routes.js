'use strict';

var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    var parserModule = require('../parser/parser');
    var parser = new parserModule();
    var REQUEST_DELAY = 60000;

    app.post('/add-film/', function (req, res) {
        var movie = {
            title: req.headers.title,
            description: req.headers.description,
            image: req.headers.image,
            rating: req.headers.rating,
            tags: req.headers.tags
        };
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
        db.collection("films").find({ isParsed: true }).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            // db.close();
        });
    });

    app.get('/settings/', function (req, res) {
        db.collection("settings").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            // db.cl`ose();
        });
    });

    app.get('/clear/', function (req, res) {

        db.collection("votesTasks").deleteMany({}, function (err, result) {});
        db.collection("users").deleteMany({}, function (err, result) {});

        db.collection("films").deleteMany({}, function (err, result) {});

        db.collection("settings").deleteMany({}, function (err, result) {
            db.collection("settings").insert({ name: 'nextUser', value: 1 }, function (err, result) {
                console.log('end');
            });
        });
    });

    app.get('/votes/', function (req, res) {
        db.collection("votesTasks").find().toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            console.log(result);
            // db.close();
        });
    });

    app.get('/parse-votes/', function (req, res) {
        setInterval(function () {
            db.collection('votesTasks').findOne({
                isParsed: false
            }, function (err, item) {
                if (err) {
                    console.log('cannot find votesTask');
                    return;
                }

                var url = item.url;
                db.collection('votesTasks').update({
                    url: url
                }, { url: url, isParsed: true }, function (err, item) {
                    if (err) {
                        console.log('update err');
                    }
                });

                parser.parse(url, function ($, res) {
                    var hrefs = [];
                    if (!$('.profileFilmsList .item').length) {
                        console.log('no profileFilmsList ');
                        return;
                    }

                    $('.profileFilmsList .item').map(function () {
                        var $a = $(this).find('a');
                        hrefs.push($a.attr('href'));

                        var mark = {
                            idUser: item.idUser,
                            rating: $(this).find('.vote').text(),
                            film: $a.attr('href')
                        };
                        console.log('Mark', mark);

                        db.collection('users').find(mark).toArray(function (err, data) {
                            if (err) {
                                console.log('insert error');
                            } else {
                                console.log('insert');
                                db.collection('users').insert(mark);
                            }
                        });
                    });

                    db.collection('films').find({
                        url: { $in: hrefs }
                    }).toArray(function (err, alreadySavedFilms) {
                        if (!err) {
                            alreadySavedFilms.forEach(function (film) {
                                var pos = hrefs.indexOf(film.url);
                                if (pos > -1) {
                                    hrefs.splice(pos, 1);
                                }
                            });
                        }
                        hrefs.forEach(function (url) {
                            var info = { url: url, isParsed: false };
                            db.collection('films').insert(info);
                        });
                    });

                    db.collection('votesTasks').update({
                        url: url
                    }, { url: url, isParsed: true }, function (err, item) {});
                });
            });
        }, REQUEST_DELAY);
    });

    var parseUser = function parseUser(id, callback) {
        var url = '/user/' + id + '/votes/list/ord/date/page/1/#list';
        parser.parse(url, function ($, res) {
            if (!$('.pagesFromTo').length) {
                console.log(res);
                return;
            }

            if (typeof callback !== 'undefined') {
                callback();
            }

            var totalNum = parseInt($('.pagesFromTo').text().split(' ').slice(-1)[0]);
            var numPage = 200;

            var _loop = function (i) {
                var url = '/user/' + id + '/votes/list/ord/date/perpage/200/page/' + i + '/#list';

                var votesTask = {
                    isParsed: false,
                    idUser: id,
                    url: url
                };

                db.collection('votesTasks').findOne(votesTask, function (err, res) {
                    console.log('find votesTask', err, res);
                    if (res === null) {
                        db.collection('votesTasks').insert(votesTask, function (err, res) {
                            console.log('insert votesTask', err);
                        });
                    }
                });
            };

            for (var i = 0; i <= totalNum / numPage; i++) {
                _loop(i);
            }
        });
    };

    app.get('/parse-user/:id', function (req, res) {
        var id = req.params.id;
        parseUser(id);
    });

    app.get('/parse-film/', function (req, res) {
        console.log('parse film start');
        setInterval(function () {
            console.log('get from db');
            var nonParsed = {
                isParsed: false
            };
            db.collection('films').findOne(nonParsed, function (err, item) {
                console.log('get', err, item);
                if (err) {
                    console.log('cannot find not parsed film');
                    return;
                }

                var url = item.url;

                parser.parse(url, function ($) {
                    var info = {};
                    info.name = $('.moviename-big').text();
                    if (info.name == '') {
                        console.log('has captcha');
                        return;
                    }
                    info.engName = $('span[itemprop="alternativeHeadline"]').text();
                    info.image = $('.film-img-box [itemprop="image"]').attr('src');
                    info.url = url;
                    info.isParsed = true;
                    info.rating = parseFloat($('.rating_ball').text());

                    db.collection('films').update({ url: url }, info, function (err, result) {
                        if (err) {
                            res.send({ 'error': 'An error has occurred' });
                        } else {
                            res.send(result.ops);
                        }
                    });
                });
            });
        }, REQUEST_DELAY);
    });

    app.get('/parse-next-user/', function (req, res) {
        setInterval(function () {
            var SETTING_NAME = 'nextUser';
            var setting = { name: SETTING_NAME };
            db.collection('settings').findOne(setting, function (err, item) {
                var id = item.value + 1;

                parseUser(id, function () {
                    db.collection('settings').update({
                        name: SETTING_NAME
                    }, { name: SETTING_NAME, value: id }, function (err, item) {
                        if (err) {
                            console.log('update err setting');
                        }
                    });
                });
            });
        }, REQUEST_DELAY);
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
            // db.close();
        });
    });
};
//# sourceMappingURL=note_routes.js.map