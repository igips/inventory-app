const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");

exports.index = (req, res) => {
	async.parallel(
		{
			item_count: (callback) => {
				Item.countDocuments({}, callback);
			},
			category_count: (callback) => {
				Category.countDocuments({}, callback);
			},
		},
		(err, results) => {
			res.render("index", { items: results.item_count, categories: results.category_count });
		}
	);
};

exports.items_list = (req, res, next) => {
	Item.find({})
		.sort({ name: 1 })
		.populate("category")
		.exec((err, list_items) => {
			if (err) {
				return next(err);
			}
			res.render("itemsList", { items_list: list_items });
		});
};

exports.item_details = (req, res, next) => {
	Item.findById(req.params.id)
		.populate("category")
		.exec((err, result) => {
			if (err) {
				return next(err);
			}
			if (result === null) {
				const err = new Error("Item not found!");
				err.status = 404;
				return next(err);
			}
			res.render("itemDetails", { item: result });
		});
};

exports.item_add_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Item add GET");
};

exports.item_add_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Item add POST");
};

exports.item_delete_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Item delete GET");
};

exports.item_delete_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Item delete POST");
};

exports.item_update_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Item update GET");
};

exports.item_update_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Item update POST");
};
