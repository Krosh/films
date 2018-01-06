module.exports = function () {
    this.parse = async function (siteUrl, callback) {
        console.log('start');
        const domain = 'https://www.kinopoisk.ru';
        const phantom = require('phantom');
        const instance = await phantom.create([], {
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
};