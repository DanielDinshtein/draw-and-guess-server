//* ------------------------------ Global Imports ------------------------------ */

var createError = require("http-errors");
var express = require("express");
var path = require("path");
const session = require("client-sessions");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

//* ------------------------------ Require Routers ------------------------------ *//

var indexRouter = require("./routes/index");
var playersRouter = require("./routes/players");
var gamesRouter = require("./routes/games");
var healthRouter = require("./routes/health");

var usersRouter = require("./routes/users");

//* ------------------------------ MongoDB- mongoose connection ------------------------------ *//

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
	console.log("Connected successfully");
});

const User = require("./models/userModel");

//* ------------------------------ express Configuration ------------------------------ *//

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

app.use(
	session({
		cookieName: "session", // the cookie key name
		secret: process.env.COOKIE_SECRET, // the encryption key
		duration: 24 * 60 * 60 * 1000, // expired after 20 sec
		activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration,
		cookie: {
			httpOnly: false,
		},
		//the session will be extended by activeDuration milliseconds
	})
);

//* ------------------------------ Cookie middleware ------------------------------ *//

app.use(function (req, res, next) {
	if (req.session && req.session.user_id) {
		User.find({})
			.then((users) => {
				if (users.find((x) => x._id === req.session.user_id)) {
					req.user_id = req.session.user_id;
				}
				next();
			})
			.catch((error) => next());
	} else {
		next();
	}
});

//* ------------------------------ Routings ------------------------------ *//

app.use("/", indexRouter);
app.use("/players", playersRouter);
app.use("/games", gamesRouter);
app.use("/health", healthRouter);

app.use("/users", usersRouter);

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
