const path = require("path");
const pupp = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const u = require("url");
const fs = require("fs");
pupp.use(StealthPlugin());
const mode =
	process.env.NODE_ENV === "production"
		? { args: ["--no-sandbox"], headless: true }
		: {
				args: ["--no-sandbox"],
				headless: false,
				executablePath: "/usr/bin/google-chrome",
		  };

const getHTM = (url) =>
	new Promise(async (res) => {
		const browser = await pupp.launch(mode);
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "domcontentloaded" });
		const htm = await page.content();
		console.log(htm);
		return res(htm);
	});

async function screenshot(url, fullPage = false, scrolly = false, wait4 = 1) {
	const browser = await pupp.launch(mode);
	const page = await browser.newPage();
	// console.log(url);
	await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
	if (fullPage)
		await page.evaluate((scrollY) => {
			var tick,
				sl = scrollY || document.body.scrollHeight
				i = 1;
			tick = setInterval(() => {
				
				if (i > sl) clearInterval(tick);
				i += 100;
				window.scrollTo(0, i);
			}, 100);
		}, scrolly);
	await page.waitForTimeout(wait4);

	if (!fs.existsSync(path.join(__dirname, "/..", "static", "screenshots")))
		fs.mkdirSync(path.join(__dirname, "/..", "static", "screenshots"));
	var name = path.basename(u.parse(url).pathname);
	name = !name.length ? "image" + Date.now() : name;
	const uri = path.join(
		__dirname,
		"/..",
		"static",
		"screenshots",
		name + ".png"
	);
	console.log({ path: uri, fullPage: !!fullPage , wait4 : wait4})
	await page.screenshot({ path: uri, fullPage: !!fullPage });
	await browser.close();
	return uri;
}

module.exports = {
	getHTM: getHTM,
	screenshot: screenshot,
};
