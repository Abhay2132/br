module.exports = () => {
	const exp = require("express"),
		app = exp(),
		router = require("./mods/router"),
		hbs = require("express-handlebars"),
		cors = require("cors"),
		path = require("path");

	global.isPro = process.env.NODE_ENV === "production";
	global.log = console.log;
	global.__port = process.env.PORT || 3000;
	global.j = require("path").join;
	global.errLog = (...a) => console.error(...a);
	global.sdir = path.resolve("src", "static");

	let engine = hbs.create({
		defaultLayout: "main",
		extname: "hbs",
	}).engine;
	app.engine("hbs", engine);
	app.set("view engine", "hbs");
	app.set("views", j(sdir, "views"));

	app.use(exp.static(j(sdir, "public")));
	app.use(cors());

	app.use(exp.json());
	app.use(router);
	let fs = require("fs");
	if (fs.existsSync(j(sdir, "files")))
		fs.rmSync(j(sdir, "files"), { recursive: true });
	app.listen(__port, () => log("Server Started at port :", __port));
};
