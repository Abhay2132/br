const pupp = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pupp.use(StealthPlugin())
const mode = process.env.NODE_ENV === "production" ? { args: ['--no-sandbox'], headless : true} : { args: ['--no-sandbox'], headless : false, executablePath : "/usr/bin/google-chrome"}

const getHTM = url => new Promise( async res => {
    const browser = await pupp.launch(mode)
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