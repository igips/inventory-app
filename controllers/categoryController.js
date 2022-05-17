const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");

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

exports.category_add_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Category add GET");
};

exports.category_add_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Category add POST");
};

exports.category_delete_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Category delete GET");
};

exports.category_delete_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Category delete POST");
};

exports.category_update_get = (req, res) => {
	res.send("NOT IMPLEMENTED: Category update GET");
};

exports.category_update_post = (req, res) => {
	res.send("NOT IMPLEMENTED: Category update POST");
};
