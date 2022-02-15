var express = require("express");
var router = express.Router();





router.get("/", function (req, res, next) {
	res.status(200).send();
});

router.get("/waiting", function (req, res, next) {
	res.status(200).send();
});

router.get("/wordChoosing", function (req, res, next) {
	res.status(200).send();
});

router.get("/drawing", function (req, res, next) {
	res.status(200).send();
});

router.get("/guessing", function (req, res, next) {
	res.status(200).send();
});

module.exports = router;
