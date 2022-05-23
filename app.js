const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require('compression');
const helmet = require('helmet');
const  bodyParser = require('body-parser');
const fs = require('fs');



const indexRouter = require("./routes/index");

const app = express();
const mongoose = require("mongoose");

const mongoDB = process.env.db;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine", "ejs");

app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "bin/public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;

