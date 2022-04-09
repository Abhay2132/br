const pupp = require("puppeteer");
const fs = require("fs"),
	path = require("path"),
	adm = require("adm-zip");
	
	function imgD({url = false, minSize = 1024}) {
		let ddir = path.resolve("src", "test", "imgs");

	function delDownloadDir() {
		if (fs.existsSync(ddir)) fs.rmSync(ddir, { recursive: true });
		if (!fs.existsSync(ddir)) fs.mkdirSync(ddir, { recursive: true });
	}

	this.downloadImages = async function () {
		delDownloadDir();
		const browser = await pupp.launch({
			headless: true,
			executablePath: "/usr/bin/google-chrome",
			defaultViewport: null,
		});
		const newPage = await browser.newPage();
		var i = 1;
		newPage.on("response", async (response) => {
			const url = response.url();
			if (response.request().resourceType() === "image") {
				const fileName = url.split("/").pop();
				let ext = extname(fileName);
				if (!["jpg", "png", "gif"].includes(ext))
					return console.log("not image :", fileName, ext);
				const filePath = path.resolve(__dirname, "imgs", i++ + ". " + fileName);
				console.log("img :", filePath);
				response.buffer().then((file) => {
					const writeStream = fs.createWriteStream(filePath);
					writeStream.write(file);
				});
			}
		});
		await newPage.goto(siteURL, { waitUntil: "networkidle2" });
		await browser.close();
		await moveIcons(minSize);
		await zipDir({ dir: ddir, ignore: ["icons"] });
		return path.join(ddir, "imgs.zip")
	};

	const moveIcons = (minSize) =>
		new Promise((res) => {
			let ic = "icons";
			fs.mkdirSync(path.join(ddir, ic));
			fs.readdir(ddir, (err, files) => {
				if (err) return res(!!console.error(err));
				files.forEach((file) => {
					if (file == ic) return;
					let fp = path.join(ddir, file);
					let { size } = fs.statSync(fp);
					if (size < minSize)
						fs.renameSync(
							path.join(ddir, file),
							path.join(ddir, ic, file),
							{ recursive: true },
							console.log("moved : %s (%i kb)", file, (size / 1024).toFixed(2))
						);
				});
				return res(true)
			});
		});
 
	const zipDir = ({ dir = false, ignore = [] }) =>
		new Promise((res) => {
			if (!dir) return res(false);
			let zip = new adm();
			fs.readdir(dir, (err, files) => {
				if (err) return res(!!console.error(err));
				files.forEach((file) => {
					if (ignore.includes(file)) return;
					zip.addLocalFile(path.join(dir, file));
				});
				zip.writeZip(path.join(dir, "imgs.zip"));
				res(true);
			});
		});

	const extname = (str) => str.split(".").at(-1).split("?")[0];
}

const siteURL = "https://www.topmanhua.com/manhua/eternal-life/chapter-13/";
let ms = 50 * 1024;
new imgD({ url: siteURL, minSize: ms }).downloadImages();
