function logger (req, res, next){
    let colors = require("colors")
    let methods = {
        "GET" : "green", 
        "POST" : "yellow",
        "PUT" : "blue",
        "DELTE" : "red"
    }
    let {method, url} = req
    process.stdout.write("\n" + colors[methods[method]](method) + " " + url);
    next();
}

module.exports = {
    logger : logger
}