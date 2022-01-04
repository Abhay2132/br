const pupp = require("puppeteer");

console.clear();

async function dev() {
    const browser = await pupp.launch({
        args: ["--no-sandbox"],
        headless: false,
        defaultViewport: null
    })
    var page = await browser.newPage();
    let url = "https://animixplay.to/v1/mob-psycho-100";

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 })
    await page.click("i.dlbutton.glyphicon.glyphicon-download-alt")

    while (true) {
        let npages = (await browser.pages()).length;
        if (npages === 3) break;
        await (new Promise(res => setTimeout(res, 400)))
    } // to make sure page is opened !

    let newPage = await (await browser.pages())[2]
    console.log(newPage.url())
    await newPage.waitForSelector("div.dowload > a")

    let i720p = await newPage.$eval("div.mirror_link", (ml) => {
        let tags = ml.children;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].textContent.includes("360")) return i+1;
        }
    })
    console.log("720p is %ith tag ;)", i720p)

    await page._client.send('Page.setDownloadBehavior', {   // Set Download Path;
        behavior: 'allow',
        downloadPath: __dirname 
    });

    await newPage.click(`div.mirror_link > div.dowload:nth-child(${i720p}) > a`);
    await newPage.waitForTimeout(30000);
    browser.close();
}

dev();

function eval4dlnks() {
    return new Function(`
    var lnks = document.querySelectorAll("div.dowload > a")
    var dlnks = []
    lnks.forEach(lnk => {
        var txt = lnk.textContent;
        if(txt.endsWith("mp4)")) dlnks.push(lnk);
    });
    return dlnks.map( a => ({href : a.getAttribute("href"), txt : a.textContent}));
`)
}