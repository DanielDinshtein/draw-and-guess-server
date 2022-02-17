var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
	console.log("Connected successfully");
});

var indexRouter = require("./routes/index");
var playersRouter = require("./routes/players");
var gamesRouter = require("./routes/games");
var healthRouter = require("./routes/health");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsConfig = {
	origin: true,
	credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use("/", indexRouter);
app.use("/players", playersRouter);
app.use("/games", gamesRouter);
app.use("/health", healthRouter);

const userModel = require("./models/userModel");
const gameSessionsModel = require("./models/gameSessionsModel");

app.post("/add_game", async (request, response) => {
	const gameSession = new gameSessionsModel(request.body);

	try {
		await gameSession.save();
		response.send(gameSession);
	} catch (error) {
		response.status(500).send(error);
	}
});


app.post("/add_user", async (request, response) => {
	const user = new userModel(request.body);

	try {
		await user.save();
		response.send(user);
	} catch (error) {
		response.status(500).send(error);
	}
});

app.get("/users", async (request, response) => {
	const users = await userModel.find({});

	try {
		response.send(users);
	} catch (error) {
		response.status(500).send(error);
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
