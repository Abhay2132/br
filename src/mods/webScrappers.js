const puppeteer = require('puppeteer'),
    j = require("path").join,
    fs = require("fs")

async function getResult(url) {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
    let href = await page.evaluate(() => {
        document.querySelector("#RollNo").value = "200211070003";
        window.stop();
        document.querySelector("input[value='GET RESULT']").click();
        return window.location.href
    })
    page.on("domcontentloaded", async (event) => {
        let result = await page.evaluate(()=>{
            let tags = document.querySelectorAll("tbody > tr > td")
            return tags[86].textContent;
        })
        log("DOM loaded !!!", result) 
    })
}

module.exports = {
    getResult: getResult
}

// tagClass = "zaragoza"