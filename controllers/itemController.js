const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "public/images" });
const path = require("path");
const fs = require("fs");

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
	upload.single("uploadImage"),
	body("name").trim().escape(),
	body("brand").trim().escape(),
	body("category").escape(),
	body("stock").trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		let item = new Item({
			name: req.body.name,
			brand: req.body.brand,
			stock: req.body.stock,
		});

		if (req.body.category !== "") {
			item.category = req.body.category;
		}

		if (req.file) {
			item.picLoc = {
				data: fs.readFileSync(path.join("public/images/" + req.file.filename)),
				contentType: "image/png",
			};
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
							found_item.stock !== req.body.stock ||
							(req.file.filename !== found_item.picLoc.data && req.file.filename)
						) {
							if (req.file.filename) {
								Item.findByIdAndUpdate(
									found_item._id,
									{
										stock: req.body.stock,
										category: req.body.category !== "" ? req.body.category : found_item.category,
										picLoc: {
											data: fs.readFileSync(path.join("public/images/" + req.file.filename)),
											contentType: "image/png",
										},
									},
									(err, theItem) => {
										if (err) {
											return next(err);
										}

										if (req.file) {
											fs.unlink(`public/images/${req.file.filename}`, (err) => {
												if (err) {
													console.log(err);
												}
											});
										}

										res.redirect(theItem.url);
									}
								);
							} else {
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
							}
						} else {
							res.redirect(found_item.url);
						}
					} else {
						item.save((err) => {
							if (err) {
								return next(err);
							}

							if (req.file) {
								fs.unlink(`public/images/${req.file.filename}`, (err) => {
									if (err) {
										console.log(err);
									}
								});
							}

							res.redirect(item.url);
						});
					}
				}
			);
		}
	},
];

exports.item_delete_get = (req, res, next) => {
	Item.findById(req.params.id).exec((err, result) => {
		if (err) {
			return next(err);
		}
		if (result === null) {
			res.redirect("/items");
		}

		res.render("itemDelete", {
			title: "Delete",
			item: result,
		});
	});
};

exports.item_delete_post = (req, res, next) => {
	Item.findByIdAndRemove(req.body.itemId, function deleteItem(err) {
		if (err) {
			return next(err);
		}

		res.redirect("/items");
	});
};

exports.item_update_get = (req, res, next) => {
	async.parallel(
		{
			item: (callback) => {
				Item.findById(req.params.id).populate("category").exec(callback);
			},
			categories: (callback) => {
				Category.find(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.item === null) {
				const err = new Error("Item not found!");
				err.status = 404;
				return next(err);
			}
			res.render("itemForm", {
				title: "Edit item",
				categories: results.categories,
				item: results.item,
				errors: "",
			});
		}
	);
};

exports.item_update_post = [
	upload.single("uploadImage"),
	body("name").trim().escape(),
	body("brand").trim().escape(),
	body("category").escape(),
	body("stock").trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		Item.findById(req.params.id).exec((err, result) => {
			if (err) {
				return next(err);
			}

			let item = new Item({
				name: req.body.name,
				brand: req.body.brand,
				stock: req.body.stock,
				_id: req.params.id,
			});

			if (req.body.category !== "") {
				item.category = req.body.category;
			}

			if (req.file) {
				item.picLoc = {
					data: fs.readFileSync(path.join("public/images/" + req.file.filename)),
					contentType: "image/png",
				};
			}

			if (!req.file && result.picLoc.data) {
				item.picLoc = result.picLoc;
			}

			if (!errors.isEmpty()) {
				Category.find({}).exec((err, result) => {
					if (err) {
						return next(err);
					}

					res.render("itemForm", {
						title: "Edit item",
						categories: result,
						item: item,
						errors: errors.array(),
					});

					if (req.file) {
						fs.unlink(`public/images/${req.file.filename}`, (err) => {
							if (err) {
								console.log(err);
							}
						});
					}

					

					return;
				});
			} else {
				Item.findByIdAndUpdate(req.params.id, item, {}, (err, theItem) => {
					if (err) {
						return next(err);
					}

					if (req.file) {
						fs.unlink(`public/images/${req.file.filename}`, (err) => {
							if (err) {
								console.log(err);
							}
						});
					}
					
					

					res.redirect(theItem.url);
				});
			}
		});
	},
];
