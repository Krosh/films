'use strict';

var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    var parserModule = require('../parser/parser');
    var parser = new parserModule();

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
            db.close();
        });
    });

    app.get('/parse-user/:id', function (req, res) {
        var id = req.params.id;
        var url = '/user/' + id + '/votes/list/ord/date/page/1/#list';
        parser.parse(url, function ($, res) {
            if (!$('.pagesFromTo').length) {
                console.log(res);
                return;
            }

            var totalNum = parseInt($('.pagesFromTo').text().split(' ').slice(-1)[0]);
            var numPage = 200;
            console.log(totalNum);

            var _loop = function (i) {
                var url = '/user/' + id + '/votes/list/ord/date/perpage/200/page/' + i + '/#list';
                setTimeout(function () {
                    parser.parse(url, function ($) {
                        var hrefs = [];
                        $('.profileFilmsList .item').map(function () {
                            var $a = $(this).find('a');
                            hrefs.push($a.attr('href'));

                            var mark = {
                                idUser: id,
                                rating: $(this).find('.vote').text(),
                                film: $a.attr('href')
                            };

                            db.collection('films').find(mark).toArray(function (err, data) {
                                if (err) {
                                    db.collection('films').insert(mark);
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
                    });
                }, i * 60000);
            };

            for (var i = 0; i <= totalNum / numPage; i++) {
                _loop(i);
            }
        });
    });

    app.get('/parse-film/', function (req, res) {

        var url = undefined;

        console.log('test');
        setInterval(function () {

            url = '';

            db.collection('films').findOne({
                isParsed: false
            }, function (err, item) {
                if (err) {
                    return;
                }

                url = item.url;

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
            }, 30000);
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