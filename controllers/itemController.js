const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

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

exports.item_add_get = (req, res, next) => {
	Category.find({}).exec((err, results) => {
		if (err) {
			return next(err);
		}

		results.sort((a, b) => a.name.localeCompare(b.name));

		res.render("itemForm", { title: "Add item", categories: results, item: "", errors: "" });
	});
};

exports.item_add_post = [
	body("name").trim().escape(),
	body("brand").trim().escape(),
	body("category").escape(),
	body("stock").trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		let item;

		if (req.body.category !== "") {
			item = new Item({
				name: req.body.name,
				brand: req.body.brand,
				category: req.body.category,
				stock: req.body.stock,
			});
		} else {
			item = new Item({
				name: req.body.name,
				brand: req.body.brand,
				stock: req.body.stock,
			});
		}

		if (!errors.isEmpty()) {
			Category.find({}).exec((err, results) => {
				if (err) {
					return next(err);
				}
				results.sort((a, b) => a.name.localeCompare(b.name));

				res.render("itemForm", { title: "Add item", categories: results, item: item, errors: errors.array() });
			});
			return;
		} else {
			const theName = req.body.name;
			const theBrand = req.body.brand;

			Item.findOne({ name: { $regex: theName, $options: "i" }, brand: { $regex: theBrand, $options: "i" } }).exec(
				(err, found_item) => {
					if (err) {
						return next(err);
					}

					if (found_item) {
						if (
							(found_item.category && req.body.category !== found_item.category) ||
							found_item.stock !== req.body.stock
						) {
							Item.findByIdAndUpdate(
								found_item._id,
								{
									stock: req.body.stock,
									category: req.body.category !== "" ? req.body.category : found_item.category,
								},
								(err, theItem) => {
									if (err) {
										return next(err);
									}
									res.redirect(theItem.url);
								}
							);
						} else {
							res.redirect(found_item.url);
						}
					} else {
						item.save((err) => {
							if (err) {
								return next(err);
							}

							res.redirect(item.url);
						});
					}
				}
			);
		}
	},
];

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
