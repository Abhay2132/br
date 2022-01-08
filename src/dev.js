const pupp = require("puppeteer"),
    mode = { args: ["--no-sandbox"], headless: process.env.NODE_ENV === "production", defaultViewport: null },
    log = (...a) => console.log(...a),
    j = require("path").join

async function start(url, q) {
    const browser = await pupp.launch(mode)
    var page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 })
    await page.waitForSelector("span.animetitle")
    let an = (await page.$eval("span.animetitle", (tag) => tag.textContent))
    await page.waitForSelector("#epslistplace > button")
    let epn = await page.$$eval("#epslistplace > button", btns => btns.length)
    await browser.close()
log("Downloading '%s' anime", an)
    for (let i = 1; i <= epn; i++) {
        log("Downloading ep%i", i)
        await downloadEp(j(url, "ep" + i), q, an)
    }
    return
    // for (let i = 1; i <= epn; i++) {
    //     // await page.close();
    //     // page = await browser.newPage();
    //     await page.goto(j(url, "ep" + i), { waitUntil: "domcontentloaded", timeout: 0 })
    //     await page.click("i.dlbutton.glyphicon.glyphicon-download-alt")

    //     while (true) {
    //         let npages = (await browser.pages()).length;
    //         if (npages === 3) break;
    //         await (new Promise(res => setTimeout(res, 400)))
    //     } // to make sure page is opened !

    //     let newPage = await (await browser.pages())[2]
    //     await newPage.close()
    //     continue;

    //     console.log(newPage.url())
    //     newPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 })
    //     await newPage.waitForSelector("div.dowload > a")

    //     let reqURL = await newPage.evaluate(q => {
    //         let tags = document.querySelectorAll("div.dowload > a");
    //         for (let a of tags) {
    //             if (a.textContent.includes(q.toString())) return a.href
    //         }
    //     }, q)
    //     console.log("%ip url :  %s)", q, reqURL)

    //     await page._client.send('Page.setDownloadBehavior', {   // Set Download Path;
    //         behavior: 'allow',
    //         downloadPath: j(__dirname, "anime", an)
    //     });

    //     // await newPage.click(`div.mirror_link > div.dowload:nth-child(${reqCn}) > a`);
    //     await newPage.evaluate(url => (location.href = (url)), reqURL)
    //     await (new Promise(res => setTimeout(res, (process.env.NODE_ENV === "production" ? 30000 : 2000))))
    //     await newPage.close();
    // }
}

const downloadEp = (url, q, an) => new Promise(async res => {

    const browser = await pupp.launch(mode)
    var page = await browser.newPage();

    await page.goto(url, { waitUntil: ["domcontentloaded", "load"], timeout: 0 })
    await page.waitForSelector("i.dlbutton.glyphicon.glyphicon-download-alt", {timeout: 5000})
    await page.click("i.dlbutton.glyphicon.glyphicon-download-alt")

    while (true) {
        let npages = (await browser.pages()).length;
        if (npages === 3) break;
        await (new Promise(res => setTimeout(res, 400)))
    } // to make sure page is opened !

    let newPage = await (await browser.pages())[2]
    if (process.argv[2] == "--skip") return res(browser.close())
    console.log(newPage.url())
    newPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 })
    await newPage.waitForSelector("div.dowload > a")

    let reqURL = await newPage.evaluate(q => {
        let tags = document.querySelectorAll("div.dowload > a");
        for (let a of tags) {
            if (a.textContent.includes(q.toString())) return a.href
        }
    }, q)
    console.log("%ip url :  %s)", q, reqURL)

    await page._client.send('Page.setDownloadBehavior', {   // Set Download Path;
        behavior: 'allow',
        downloadPath: j(__dirname, "anime", an)
    });

    // await newPage.click(`div.mirror_link > div.dowload:nth-child(${reqCn}) > a`);
    await newPage.evaluate(url => (location.href = (url)), reqURL)
    await (new Promise(res => setTimeout(res, (process.env.NODE_ENV === "production" ? 30000 : 2000))))
    await browser.close();
    res();
})

module.exports = {
    daz: start
}

let url = "https://animixplay.to/v1/mob-psycho-100";

start(url, 360);

