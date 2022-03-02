const path = require("path")
const pupp = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const u = require("url")
const fs = require("fs")
pupp.use(StealthPlugin())
const mode = process.env.NODE_ENV === "production" ? { args: ['--no-sandbox'], headless : true} : { args: ['--no-sandbox'], headless : false, executablePath : "/usr/bin/google-chrome"}

const getHTM = url => new Promise( async res => {
    const browser = await pupp.launch(mode)
    const page = await browser.newPage();
    await page.goto(url, {waitUntil : "domcontentloaded"})
    const htm = await page.content();
    console.log(htm)
    return res(htm)
})

async function screenshot (url , fullPage = true) {
    const browser = await pupp.launch(mode);
    const page = await browser.newPage();
    console.log(url)
    await page.goto(url, {waitUntil: "networkidle2"});
    if( ! fs.existsSync(path.join(__dirname, "/..", "static", "screenshots"))) fs.mkdirSync(path.join(__dirname, "/..", "static", "screenshots"))
    var name =  path.basename(u.parse(url).pathname)
    name = ! name.length ? "image"+Date.now() : name ;
    const uri = path.join(__dirname, "/..", "static", "screenshots", name + ".png");
    await page.screenshot({path : uri, fullPage: fullPage})
    await browser.close();
    return uri
}

module.exports = {
    getHTM : getHTM,
    screenshot : screenshot
}