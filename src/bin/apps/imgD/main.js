module.exports = async function (req, res) {
    if (req.method == "GET") {   
        let {token = false} = req.query || {}
        if (!token) return res.status(401).json({ error: "token is missing !" });
        return require("./core").download(token, res)
    }
	let { url = false, minSize = 10240} = req.body;
	if (!url) return res.status(401).json({ error: "url is missing !" });
	let colors = require("colors");
	let {imgD} = new require("./core");
	imgD = new imgD(url, minSize);
        
        let { ddir } = imgD.parseURL(url);
	let isDone = await imgD.isDone(ddir),
		isAlive = await imgD.isAlive(ddir);
	isPro || process.stdout.write(
		" " +
			colors[isDone ? "green" : "red"]("isDone") +
			" " +
			colors[isAlive ? "green" : "red"]("isAlive")
	);

	if (isAlive || isDone) {
		let stat = await imgD.getStat(ddir);
		return res.json(imgD.filterStat(stat));
	}

	let stat = await imgD.downloadImages(url);
	res.json(stat);
};
