const puppeteer = require('puppeteer'),
    j = require("path").join,
    fs = require("fs")

async function getResult(url) {
    writer.clear();
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
    // page.on("framenavigated", async (frame) => {
    //     try{
    //         process.stdout.write(".")
    //         let txt = await frame.content();
    //         // await fs.appendFile(j(__dirname, "..", "files", "result.htm"), txt, (err) => log(err))
    //         writer.add (txt);
    //     } catch (e) { return log(e)}
    // })
    page.on("domcontentloaded", async (event) => {
        let result = await page.evaluate(()=>{
            let tags = document.querySelectorAll("tbody > tr > td")
            return tags[86].textContent;
        })
        log("DOM loaded !!!", result)
        // writer.add(np.dom)
    })

    // page.on("framenavigated", async (frame) =>{
    //     process.stdout.write(",")
    //     let htm = await page.content();
    //     writer.add(htm);
    // })
}

const writer = {
    txt : new Array(),
    i : 0,
    live : false,
    add : function(txt){
        writer.txt.push(txt);
        if(!writer.live) writer.append();
        else process.stdout.write(" ")
    },
    path : j(__dirname, "..", "files", "index.htm"),
    clear : function(){
        fs.writeFile(writer.path, "", (err) => errLog(err));
    },
    append : function (){
        writer.live = true;
        writer.i += writer.txt.length < writer.i ? 1 : 0;
        fs.appendFile(writer.path, writer.txt[writer.i], (err) =>{
            if(err) return err;
            if(writer.txt.length < writer.i) writer.append();
            else writer.live = false;
            process.stdout.write(".")
        })
    }
}

module.exports = {
    getResult: getResult
}

// tagClass = "zaragoza"