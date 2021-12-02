const { getResult } = require("./webScrappers"),
    colors = require("colors")

module.exports = function (app) {
    app.use((req, res, next) => {
        log(colors.green(req.method), req.url)
        next();
    })

    app.get("/", (req, res, next) => {
        res.sendFile(j(__dirname, "..", "static", "views", "index.htm"));
    })

    app.get("/result/:rn", async (req, res, next) => {
        if(req.params.rn.length != 12) return res.json({error : "Invalid Roll no.  (length should be 12 digits) !"})
        let result = await getResult(req.params.rn) || {}
        res.json(result)
    })
}