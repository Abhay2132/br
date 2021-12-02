const { resolve } = require('path');
const puppeteer = require('puppeteer'),
    j = require("path").join,
    fs = require("fs")

function getResult(rn = false) {
    return new Promise(async (resolve) => {
        if (!rn) return resolve({ error: "RollNo. is not provided !" })
        const browser = await puppeteer.launch({
            // args: ['--no-sandbox']
            headless: false
        });
        const page = await browser.newPage();
        let url = "http://results.indiaresults.com/ut/sdsuv-university/query.aspx?id=1900269978"
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
        let href = await page.evaluate(eval4rn(rn))
        page.on("domcontentloaded", async (event) => {
            let result = await page.evaluate(() => {
                let tags = document.querySelectorAll("tbody > tr > td")
                return { result: tags[86].textContent };
            })
            resolve(result);
        })
    })
}

function eval4rn(rn) {
    return new Function(`
    document.querySelector("#RollNo").value = ${rn};
    window.stop();
    document.querySelector("input[value='GET RESULT']").click();
    return window.location.href
    `)
}

module.exports = {
    getResult: getResult
}

// tagClass = "zaragoza"