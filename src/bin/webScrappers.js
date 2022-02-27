const pupp = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pupp.use(StealthPlugin())

const getHTM = url => new Promise( async res => {
    const browser = await pupp.launch({ args: ['--no-sandbox'], headless : !!process.env.NODE_ENV, executablePath : "/usr/bin/google-chrome"})
    const page = await browser.newPage();
    await page.goto(url, {waitUntil : "domcontentloaded"})
    // await page.waitForTimeout(15000)
    // await page.evaluate("window.scrollTo(0, 9999999)")
    // await page.evaluate("window.scrollTo(0, 9999999)")
    // await page.evaluate("window.scrollTo(0, 9999999)")
    const htm = await page.content();
    browser.close();
    return res(htm)
})

module.exports = {
    getHTM : getHTM
}