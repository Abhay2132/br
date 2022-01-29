const pupp = require("puppeteer");

const getHTM = url => new Promise( async res => {
    const browser = await pupp.launch({ args: ['--no-sandbox'], headless : process.env.NODE_ENV })
    const page = await browser.newPage();
    await page.goto(url, {waitUntil : "networkidle2"})
    const htm = await page.content();
    browser.close();
    return res(htm)
})

module.exports = {
    getHTM : getHTM
}