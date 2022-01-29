const { getResult , getNames, getHTM} = require("./webScrappers"),
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
        let htm = await getHTM(url);
        return res.json({htm : htm});
    })
}