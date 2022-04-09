const { parse } = require("url"),
	fs = require("fs"),
	pupp = require("puppeteer"),
	adm = require("adm-zip"),
	imgDdir = j(sdir, "files", "imgD");

module.exports = {
	imgD,
	download,
};

function imgD(siteURL = false, ms = 10240) {
	const me = this;
	this.siteURL = siteURL;
    this.minSize = ms

	this.parseURL = function (url = false) {
		if (!url) return false;
		let purl = parse(url, 1);
		let { hostname, path } = purl;
		hostname = hostname.replace(/[.]/g, "_");
		path = path.replace(/[^0-9a-zA-Z_]/g, "_")
		let ddir = hostname + "_" + path;
		while (ddir.includes("__")) ddir = ddir.replace("__", "_");
		ddir = ddir.slice(0, 50);
		return { ddir };
	};

	const extname = (str) => str.split(".").at(-1).split("?")[0];

	function clearddir(ddir) {
		let ddirP = j(sdir, "files", "imgD", ddir);
		if (fs.existsSync(ddirP)) fs.rmSync(ddirP, { recursive: true });
		if (!fs.existsSync(ddirP)) fs.mkdirSync(ddirP, { recursive: true });
	}

	const zipDir = (dir = false, ignore = []) =>
		new Promise((res) => {
			if (!dir) return res(false);
			let zip = new adm();
			fs.readdir(dir, (err, files) => {
				if (err) return res(!!console.error(err));
				files.forEach((file) => {
					if (ignore.includes(file)) return;
					zip.addLocalFile(j(dir, file));
				});
				let name = require("path").basename(dir);
				zip.writeZip(j(dir, name + ".zip"));
				res(true);
			});
		});

	const moveIcons = (ddir, minSize = me.minSize) =>
		new Promise((res) => {
			let ic = "icons";
			fs.mkdirSync(j(ddir, ic));
			fs.readdir(ddir, (err, files) => {
				if (err) return res(!!console.error(err));
				files.forEach((file) => {
					if (file == ic || file == "stats.json") return;
					let fp = j(ddir, file);
					let { size } = fs.statSync(fp);
					if (size < minSize)
						fs.renameSync(
							j(ddir, file),
							j(ddir, ic, file),
							{ recursive: true },
							isPro ||
								console.log(
									"moved : %s (%i kb)",
									file,
									(size / 1024).toFixed(2)
								)
						);
				});
				return res(true);
			});
		});

	const upStats = (ddir = me.ddir, stat = me.stat) => {
		stat.tick = Date.now();
		fs.writeFileSync(j(imgDdir, ddir, "stats.json"), JSON.stringify(stat));
	};

	function startTick(ddir) {
		me.stat = {
			status: 1,
			token: ddir,
			done: false,
			sat: Date.now(),
			tick: Date.now(),
		};

		upStats(ddir, me.stat);

		me.tick = setInterval(() => upStats(ddir, me.stat), 2000);
	}

	this.ddir = this.parseURL(siteURL).ddir;

	this.downloadImages = (url = me.siteURL, minSize = 1024 * 5) =>
		new Promise(async (res) => {
			if (!url) return res({ Error: '"url is Missing !"' });

			let { ddir } = me.parseURL(url);

			clearddir(ddir);
			startTick(ddir);
			res(me.stat);
			me.stat.status = 2;

            let puppConfig = { args: ['--no-sandbox']}
            if (!isPro) puppConfig.executablePath = "/usr/bin/google-chrome"

			const browser = await pupp.launch(puppConfig);
			const newPage = await browser.newPage();
			var i = 1;
			newPage.on("response", async (response) => {
				const url = response.url();
				if (response.request().resourceType() === "image") {
					const fileName = url.split("/").pop().split("?")[0];
					let ext = extname(fileName);
					if (!["jpg", "png", "gif"].includes(ext)) return;
					const filePath = j(imgDdir, ddir, `${i++}. ${fileName}`);

					response.buffer().then((file) => {
						const writeStream = fs.createWriteStream(filePath);
						writeStream.write(file);
					});
				}
			});
			await newPage.goto(url, { waitUntil: "networkidle2" });
			await browser.close();

			me.stat.status = 3;

			let ddirP = j(imgDdir, ddir);
			await moveIcons(ddirP, minSize);
			await zipDir(ddirP, ["icons", "stats.json"]);

			me.stat.done = true;
			clearInterval(me.tick);
			upStats(ddir, me.stat);
		});

	this.getStat = (ddir) =>
		new Promise(async (res) => {
			fs.readFile(j(imgDdir, ddir, "stats.json"), (err, data) => {
				if (err) return res(console.error(err));
				return res(JSON.parse(data.toString()));
			});
		});

	this.isStarted = function (ddir = me.ddir) {
		if (!ddir) throw new Error("Error : 'ddir' is not defined !");
		return fs.existsSync(j(imgDdir, ddir, "stats.json"));
	};

	this.isAlive = async function (ddir = me.ddir) {
		if (!this.isStarted(ddir)) return false;
		// if (await this.isDone(ddir)) return true
		let { tick } = await this.getStat(ddir);
		let isTicking = Date.now() - tick < 3000;
		return isTicking;
	};

	this.isDone = async function (ddir = me.ddir, debug = false) {
		if (!this.isStarted(ddir)) return false;
		let stat = await this.getStat(ddir);
		let { done } = stat;
		if (debug) log(stat, { done });
		return done;
	};

	this.filterStat = (stat) => {
		return { status: stat.status, done: stat.done, token: stat.token };
	};
}

async function download(ddir, res) {
	let zipP = j(imgDdir, ddir, `${ddir}.zip`);
	if (!fs.existsSync(zipP))
		return res.json({ error: "images zip file is missing !" });
	let { size } = fs.statSync(zipP);
	res.set({
		"Content-Length": size,
		"Content-Type": "application/zip",
		"Content-Disposition": "attachment; filename=" + ddir + ".zip",
	});

	fs.createReadStream(zipP).pipe(res);
}
