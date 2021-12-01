const puppeteer = require('puppeteer'),
    j = require("path").join,
    fetch = require("node-fetch"),
    { parse } = require("node-html-parser"),
    dwnDir = j(__dirname, "..", "files"),
    Downloader = require('nodejs-file-downloader')

async function screenShot(url) {
    const browser = await puppeteer.launch();
    log("Brower Started")
    const page = await browser.newPage();
    log("New Page Started")
    await page.goto(url);
    log("URL loaded !")
    await page.screenshot({ path: j(__dirname, "screenShot.png") });
    log("ScreenShot Saved !")
    await browser.close();
    console.log(`Page "${url}" ScreenShot Saved !`)
}

async function fetchURL(url) {
    let page = await fetch(url);
    let html = await page.text();
    let root = parse(html);
    let pics = root.querySelectorAll(".zaragoza > a > img")
    let picsHrefs = pics.map((pic) => pic.getAttribute("src"))
    log("Downloading", picsHrefs.length, "Pics !")
    download(...picsHrefs)
}
async function savePDF(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });
    await page.pdf({ path: "src/files/file.pdf", format: 'a4' });
    await browser.close();
}

var i = 0;
async function download(...urls) {
    let url = urls[i++]
    // log(urls)
    const downloader = new Downloader({
        url: url,
        directory: "src/downloads"
    })
    try {
        await downloader.download();
        // console.log('All done');
    } catch (error) {
        console.log('Download failed :', url, "\n", error)
    }
    if(i < urls.length) download(...urls);
    else log("Dowloaded", i, "files !")
}

module.exports = {
    screenShot: screenShot,
    fetchURL: fetchURL,
    savePDF: savePDF
}

// tagClass = "zaragoza"