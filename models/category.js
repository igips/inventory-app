const mongoose = require("mongoose");
const Item = require("../models/item");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: { type: String, required: true, maxlength: 30 },
});

CategorySchema.virtual("url").get(function () {
	return "/categories/" + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);
