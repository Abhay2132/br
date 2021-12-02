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
        let result = await getResult(req.params.rn) || {}
        res.json(result)
    })
}