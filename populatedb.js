const userArgs = process.argv.slice(2);

const async = require("async");
const Item = require("./models/item");
const Category = require("./models/category");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const items = [];
const categories = [];

function categoryCreate(name, cb) {
	const category = new Category({ name: name });

	category.save((err) => {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Category: " + category);
		categories.push(category);
		cb(null, category);
	});
}

function createCategories(cb) {
	async.series(
		[
			(callback) => {
				categoryCreate("Dairy", callback);
			},
			(callback) => {
				categoryCreate("Drinks", callback);
			},
			(callback) => {
				categoryCreate("Meat", callback);
			},
			(callback) => {
				categoryCreate("Desserts", callback);
			},
		],
		cb
	);
}

function itemCreate(name, brand, stock, category, cb) {
	itemDetail = { name: name, brand: brand, stock: stock };

	if (category != false) itemDetail.category = category;

	const item = new Item(itemDetail);

	item.save((err) => {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Item: " + item);
		items.push(item);
		cb(null, item);
	});
}

function createItems(cb) {
	async.parallel(
		[
			(callback) => {
				itemCreate("Milk", "Laciate", 1, categories[0], callback);
			},
			(callback) => {
				itemCreate("Cola", "Coca-Cola", 2, categories[1], callback);
			},
			(callback) => {
				itemCreate("Salami", "Tarczynski", 1, categories[2], callback);
			},
			(callback) => {
				itemCreate("Chocolate Bar", "Nestle", 5, categories[3], callback);
			},
			(callback) => {
				itemCreate("Pickles", "Pickle Master", 1, false, callback);
			},
			(callback) => {
				itemCreate("Ketchup", "Heinz", 1, false, callback);
			},
		],
		cb
	);
}

async.series([createCategories, createItems], (err, results) => {
	if (err) {
		console.log("FINAL ERR: " + err);
	} else {
		console.log("aa");
	}
	// All done, disconnect from database
	mongoose.connection.close();
});
