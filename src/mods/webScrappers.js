const { resolve } = require('path');
const puppeteer = require('puppeteer'),
    j = require("path").join,
    fs = require("fs"),
    mode = process.env.NODE_ENV === "production" ? {args: ['--no-sandbox']} : {headless: false}

function getResult(rn = false) {
    return new Promise(async (resolve) => {
        if (!rn) return resolve({ error: "RollNo. is not provided !" })
        const browser = await puppeteer.launch(mode);
        log("Browser Started !")//, browser)
        const page = (await browser.pages())[0]
        let url = "http://results.indiaresults.com/ut/sdsuv-university/query.aspx?id=1900269978"
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
        await page.evaluate(eval4rn(rn))
        log("Roll No. Entered")
        page.on("domcontentloaded", async (event) => {
            log("Calculating Result !")
            let result = await page.evaluate(eval4result())
            log("Result : ", result)
            resolve(result);
            browser.close();
        })
    })
}

function getNames (name = false){
    return new Promise(async (resolve) => {
        if (!name) return resolve({ error: "Name is not provided !" })
        const browser = await puppeteer.launch(mode);
        log("Browser Started !")//, browser)
        const page = (await browser.pages())[0]
        let url = "http://results.indiaresults.com/ut/sdsuv-university/query.aspx?id=1900269978"
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
        await page.evaluate(eval4names(name))
        log("Roll No. Entered")
        page.on("domcontentloaded", async (event) => {
            log("Calculating Result !")
            let names = await page.evaluate(eval4getnames())
            log("Names : ", names)
            resolve(names);
            browser.close();
        })
    })
}

function eval4rn(rn) {  //evaluate Roll No. and submit
    return new Function(`
    document.querySelector("#RollNo").value = "${rn}";
    window.stop();
    document.querySelector("input[value='GET RESULT']").click();
    return window.location.href
    `)
}

function eval4names(name) {  //evaluate Name and submit
    return new Function(`
    document.querySelector("#txtName").value = "${name}";
    window.stop();
    document.querySelectorAll("input[value='GET RESULT']")[1].click();
    return window.location.href
    `)
}

function eval4result() {
    return new Function(`
    let tag = document.querySelectorAll("#midd_part_UN b");
    if (tag.length) return { error: tag[0].textContent };
    let markstags = document.querySelectorAll("tr > td > table > tbody > tr > td > table > tbody > tr > td.border1"),
        pdtags = document.querySelectorAll("div#midd_part_UN > table > tbody > tr > td > table > tbody > tr > td.border1");
    let result = {
        name: pdtags[3].textContent,
        rollno: pdtags[1].textContent,
        enrollno: pdtags[5].textContent,
        result: pdtags[pdtags.length - 1].textContent,
        tm: pdtags[pdtags.length - 3].textContent
    },
        a = [
            markstags[10].textContent, markstags[11].textContent, markstags[12].textContent, markstags[13].textContent, markstags[18].textContent
        ],
        b = [markstags[20].textContent, markstags[21].textContent, markstags[22].textContent, markstags[23].textContent, markstags[28].textContent
        ],
        c = [markstags[30].textContent, markstags[31].textContent, markstags[32].textContent, markstags[33].textContent, markstags[38].textContent
        ]
    result.sub = pdtags[13].textContent[0] == "M" ? "PCM" : "ZBC";
    let subOrder = pdtags[11].textContent[0] + pdtags[12].textContent[0] + pdtags[13].textContent[0]
    result[subOrder[0]] = a;
    result[subOrder[1]] = b;
    result[subOrder[2]] = c;
    return result;
    `);
}

function eval4getnames (){
    return new Function(`
        var names = document.querySelectorAll("#GridView1 > tbody > tr.border1 > td")
        var data = []; 
        for( let r=1, n=2; n < names.length ; r+=4, n+=4 ) {
            data.push([names[r].textContent, names[n].textContent])
        }; 
        return data;
    `)
}


module.exports = {
    getResult: getResult,
    getNames : getNames
}

// tagClass = "zaragoza"