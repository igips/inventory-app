const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.category_list = (req, res) => {
	Category.find({})
		.sort({ name: 1 })
		.exec(async (err, list_category) => {
			if (err) {
				return next(err);
			}

			const b = [];

			for (const cat of list_category) {
				const a = await Item.countDocuments({ category: cat._id });
				b.push(a);
			}

			res.render("categoryList", { category_list: list_category, count: b });
		});
};

exports.category_details = (req, res, next) => {
	async.parallel(
		{
			category: (callback) => {
				Category.findById(req.params.id).exec(callback);
			},
			category_items: (callback) => {
				Item.find({ category: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.gente === null) {
				const err = new Error("Category not found!");
				err.status = 404;
				return next(err);
			}

			res.render("categoryDetails", { category: results.category, category_items: results.category_items });
		}
	);
};

exports.category_add_get = (req, res, next) => {
	res.render("categoryForm", { title: "Add category", category: "", errors: "" });
};

exports.category_add_post = [
	body("name").trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		const category = new Category({ name: req.body.name });

		if (!errors.isEmpty()) {
			res.render("categoryForm", { title: "Add category", category: category, errors: errors.array() });
			return;
		} else {
			const theName = req.body.name;

			Category.findOne({ name: { $regex: theName, $options: "i" } }).exec((err, found_category) => {
				if (err) {
					return next(err);
				}

				if (found_category) {
					res.redirect(found_category.url);
				} else {
					category.save((err) => {
						if (err) {
							return next(err);
						}

						res.redirect(category.url);
					});
				}
			});
		}
	},
];

exports.category_delete_get = (req, res, next) => {
	async.parallel(
		{
			category: (callback) => {
				Category.findById(req.params.id).exec(callback);
			},
			category_items: (callback) => {
				Item.find({ category: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.category === null) {
				res.redirect("/categories");
			}

			res.render("categoryDelete", {
				title: "Delete",
				category: results.category,
				category_items: results.category_items,
			});
		}
	);
};

exports.category_delete_post = (req, res, next) => {
	async.parallel(
		{
			category: (callback) => {
				Category.findById(req.body.categoryId).exec(callback);
			},
			category_items: (callback) => {
				Item.find({ category: req.body.categoryId }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}

			if (results.category_items.length > 0) {
				res.render("categoryDelete", {
					title: "Delete",
					category: results.category,
					category_items: results.category_items,
				});
				return;
			} else {
				Category.findByIdAndRemove(req.body.categoryId, function deleteCategory(err) {
					if (err) {
						return next(err);
					}
					res.redirect("/categories");
				});
			}
		}
	);
};

exports.category_update_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Category update GET");
};

exports.category_update_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Category update POST");
};
