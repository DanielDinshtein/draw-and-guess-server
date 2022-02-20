//* ------------------------------ Global Imports ------------------------------ */

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");

var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

//* ------------------------------ Require Routers ------------------------------ *//

var indexRouter = require("./routes/index");
var healthRouter = require("./routes/health");

var usersRouter = require("./routes/users");
var gameStageRouter = require("./routes/gameStage");

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

app.use(bodyParser.json());

//* ------------------------------ Cors & session ------------------------------ *//

const corsConfig = {
	origin: true,
	methods: "GET,PUT,POST",
	credentials: true,
	optionsSuccessStatus: 202,
};

app.use(cors(corsConfig));
// app.options("*", cors(corsConfig));

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: false, //
			maxAge: null,
		},
	})
);

// Add headers before the routes are defined
app.use(function (req, res, next) {
	// res.setHeader("Access-Control-Expose-Headers", "Cookie, Set-Cookie, session, userID, sessionID");
	res.setHeader("Access-Control-Expose-Headers", "userID, gameID");

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", true);

	// Pass to next layer of middleware
	next();
});

//* ------------------------------ Cookie middleware ------------------------------ *//

app.use(function (req, res, next) {
	if (req.session && req.session.user_id) {
		User.find({})
			.then((users) => {
				if (users.find((x) => JSON.stringify(x._id) === req.session.user_id)) {
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
app.use("/health", healthRouter);

app.use("/users", usersRouter);
app.use("/gameStage", gameStageRouter);

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
