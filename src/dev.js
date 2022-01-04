const pupp = require("puppeteer");

(async function (){
    const browser = await pupp.launch({args : ["--no-sandbox"],
        headless : false
    })
    var page = await browser.newPage();
    let url = "https://animixplay.to/v1/mob-psycho-100";

    let pages = await browser.pages();
    let frames = await page.frames();
    console.log("pages : %i | frames : %i", pages.length, frames.length)

    await page.goto(url, {waitUntil: "domcontentloaded", timeout: 0})
    await page.click("i.dlbutton.glyphicon.glyphicon-download-alt")
    // let href = await page.evaluate(new Function(`
    //     return window.location.href`)) || ""
    pages = await browser.pages();
    frames = await page.frames();

    console.log("pages : %i | frames : %i", pages.length, frames.length)
    browser.close();
})()

const eval4download = () => (new Function(`
    var lnks = document.querySelectorAll("div.dowload > a")
    var dlnks = []
    lnks.forEach(lnk => {
        var txt = lnk.textContent;
        if(txt.endsWith("mp4)")) dlnks.push(lnk);
    });
    return dlnks.map( a => ({href : a.getAttribute("href"), txt : a.textContent}));
`))