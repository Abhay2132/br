const { resolve } = require('path');
const puppeteer = require('puppeteer'),
    j = require("path").join,
    fs = require("fs")

function getResult(rn = false) {
    return new Promise(async (resolve) => {
        if (!rn) return resolve({ error: "RollNo. is not provided !" })
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
            // headless: false
        });
        const page = await browser.newPage();
        let url = "http://results.indiaresults.com/ut/sdsuv-university/query.aspx?id=1900269978"
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
        let href = await page.evaluate(eval4rn(rn))
        page.on("domcontentloaded", async (event) => {
            let result = await page.evaluate(eval4result())
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

function eval4result() {
    return new Function(`
    let markstags = document.querySelectorAll("tr > td > table > tbody > tr > td > table > tbody > tr > td.border1"), pdtags = document.querySelectorAll("div#midd_part_UN > table > tbody > tr > td > table > tbody > tr > td.border1"); 
    let result = {
        p1 : markstags[20].textContent,
        p2 : markstags[21].textContent,
        p3 : markstags[22].textContent,
        pp : markstags[23].textContent,
        ptht : markstags[24].textContent,
        pt : markstags[28].textContent,
        c1 : markstags[10].textContent,
        c2 : markstags[11].textContent,
        c3 : markstags[12].textContent,
        cp : markstags[13].textContent,
        ctht : markstags[14].textContent,
        ct : markstags[18].textContent,
        m1 : markstags[30].textContent,
        m2 : markstags[31].textContent,
        m3 : markstags[32].textContent,
        mp : markstags[33].textContent,
        mtht : markstags[43].textContent,
        mt : markstags[38].textContent,
        gm : markstags[41].textContent,
        name : pdtags[3].textContent,
        rollno : pdtags[1].textContent,
        enrollno : pdtags[5].textContent,
        result : pdtags[19].textContent,
        tm : pdtags[17].textContent
    }
    return result;
`);
}

module.exports = {
    getResult: getResult
}

// tagClass = "zaragoza"