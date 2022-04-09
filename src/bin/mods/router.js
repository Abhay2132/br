const colors = require("colors"),
	router = require("express").Router(),
	{ logger } = require("./hlpr");

router.use(logger);

router.get("/", (req, res) => {
	return res.render("index");
});

router.post("/imgD", require("../apps/imgD/main"));
router.get("/imgD/download", require("../apps/imgD/main"))

module.exports = router;
