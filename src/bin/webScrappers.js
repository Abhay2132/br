const pupp = require("puppeteer");

const getHTM = url => new Promise( async res => {
    const browser = await pupp.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage();
    await page.goto(url, {waitUntil : "domcontentloaded"})
    const htm = await page.content();
    browser.close();
    return res(htm)
})

module.exports = {
    getHTM : getHTM
}