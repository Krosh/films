module.exports = function () {
    const REQUEST_DELAY = 10000;

    const parse = async function (siteUrl, callback) {
        console.log('start ', siteUrl);
        const domain = 'https://www.kinopoisk.ru';
        const phantom = require('phantom');
        const ProxyModule = require('./proxies');
        const proxies = new ProxyModule().proxies;

        const proxy = proxies[Math.floor(Math.random() * proxies.length)];

        console.log('proxy', proxy);
        const instance = await phantom.create(['--proxy=' + proxy], {
            // logLevel: 'debug',
        });
        const page = await instance.createPage();
        await page.setting('javascriptEnabled', false)
        await page.setting('loadImages', false);
        console.log('opening');
        await page.open(domain + siteUrl);
        console.log('parse');
        // const response = await page.evaluate(() => document.title); //
        // console.log(response);
        // var title = page.invokeMethod('evaluate', function() {
        //     return document.title;
        // });
        const result = await page.property('content');
        const cheerio = require('cheerio');
        const $ = cheerio.load(result);
        callback($, result);
        // .then(function (content) {
        //     console.log(content);
        // });
    }

    let parseUser = function (id, callback, app, db) {
        const url = `/user/${id}/votes/list/ord/date/page/1/#list`;
        parse(url, ($, res) => {

            var hasModeratorPage = $('li.off.menuButton3 span').text() == 'Оценки';
            var error404 = $('h1').text() == '404 — Страница не найдена';
            if (!$('.pagesFromTo').length && !error404 && !hasModeratorPage) {
                console.log(res);
                return;
            }

            if (typeof callback !== 'undefined') {
                callback();
            }

            if (error404) {
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

    this.parseUser = (app, db) => {
        return (req, res) => {
            const id = req.params.id;
            parseUser(id, () => {
            }, app, db);
        }
    }

    this.parseNextUser = (app, db) => {
        return (req, res) => {
            console.log('parse next uset');
            setInterval(() => {
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
                    }, app, db);
                });
            }, REQUEST_DELAY)
        }
    }

    this.parseVotes = (app, db) => {
        return (req, res) => {
            console.log('prse-votes');
            setInterval(() => {
                db.collection('votesTasks').findOne({
                    isParsed: false
                }, (err, item) => {
                    if (err) {
                        console.log('cannot find votesTask');
                        return;
                    }

                    db.collection('votesTasks').findOne({
                        isParsed: true,
                        url: item.url
                    }, (err, res) => {
                        if (err || res == null) {
                            console.log(item);

                            let url = item.url;
                            db.collection('votesTasks').update({
                                url: url
                            }, {url: url, isParsed: true}, (err, item) => {
                                if (err) {
                                    console.log('update err');
                                }
                            });

                            parse(url, ($, res) => {
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
                        } else {
                            console.log('copy, delete this');
                            db.collection('votesTasks').deleteOne({
                                _id: item._id,
                            }, (err, res) => {

                            });
                        }
                    })
                });
            }, REQUEST_DELAY)
        }
    }

    this.parseFilm = (app, db) => {
        return (req, res) => {
            console.log('parse film start');
            setInterval(function () {
                console.log('get from db');
                db.collection('films')
                    .aggregate([
                        {$match: {isParsed: false}},
                        {$sample: {size: 1}},
                    ])
                    .toArray(function (err, result) {
                        if (err) {
                            console.log('cannot find not parsed film');
                            return;
                        }
                        const item = result.pop();
                        console.log('get', err, item);

                        let url = item.url;

                        parse(url, ($) => {
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
        }
    }
};