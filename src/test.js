const pupp = require("puppeteer"),
	log = (...a) => console.log(...a),
	j = require("path").join;

(async () => {
	const browser = await pupp.launch({ headless: false, defaultViewport: null });
	var page = await browser.newPage();
	await page.goto("http://localhost:3000/download", {
		waitUntil: "networkidle2",
	});

	await page._client.send("Page.setDownloadBehavior", {
		// Set Download Path;
		behavior: "allow",
		downloadPath: j(__dirname, "files"),
	});

	await page.waitForSelector("input");
	let blob = await page.evaluate(() => {
		const data = new Promise((res) => {
			document.querySelector("input").value = "code.deb";
			setTimeout(async () => {
				let blob = await dwnld();
				res(blob);
			}, 5000);
		});
		return data;
	});
	log("fetch blob evaluated !", blob);
	browser.close();
	// await page.click("button.button");
})();

