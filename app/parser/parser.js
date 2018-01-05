module.exports = function () {
    this.parse = async function (siteUrl, callback) {
        console.log('start');
        var phantom = require('phantom');
        const instance = await phantom.create([], {
            // logLevel: 'debug',
        });
        const page = await instance.createPage();
        await page.setting('javascriptEnabled', false)
        await page.setting('loadImages', false);
        console.log('opening');
        await page.open(siteUrl);
        console.log('parse');
        // const response = await page.evaluate(() => document.title); //
        // console.log(response);
        // var title = page.invokeMethod('evaluate', function() {
        //     return document.title;
        // });
        const result = await page.property('content');
        callback(result);
        // .then(function (content) {
        //     console.log(content);
        // });
}
};