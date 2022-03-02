const { getHTM, screenshot} = require("./webScrappers"),
    colors = require("colors")

module.exports = function (app) {
    app.use((req, res, next) => {
        log(colors.green(req.method), req.url)
        next();
    })

    app.get("/", (req, res) =>{
        return res.sendFile(j(__dirname , "..", "static", "views", "index.htm"))
    })

    app.get("/getHTM", async (req, res) => {
        let url = req.query.url || false;
        if( ! url ) return res.json({error : "URL is missing in query !"})
        url = url.startsWith("http") ? url : "https://"+url
        let htm = await getHTM(url);
        return res.end(htm);
    })

    app.get("/screenshot", async (req, res) => {
        let {url = false, fp = false, scrolly = false, wait4 = 100} = req.query
        if (!url) return res.status(401).json({error: "url missing in query !"})
        url = url.startsWith("http") ? url : "https://"+url
        uri = await screenshot(url, fp, scrolly, wait4)
        res.download(uri, () => require("fs").rmSync(uri))
    })
}