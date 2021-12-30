const exp = require("express"),
    app = exp(),
    rh = require("./mods/routeHander"),
    hbs = require("express-handlebars"),
    cors = require("cors")

global.log = console.log;
global.j = require("path").join;
global.errLog = function (err){ if(err) log(err) }

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', j(__dirname, "static", "views"));

app.use(exp.static(j(__dirname, "static", "public")))
app.use(cors())
app.locals.port = process.env.PORT || 5000;

rh(app)

app.listen(app.locals.port, ()=> log("Server Started at port :", app.locals.port))
