const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema ({
    name: {type: String, required: true, maxlength: 30},
    brand: {type: String, required: true, maxlength: 30},
    category: {type: Schema.Types.ObjectId, ref: "Category"},
    stock: {type: Number, required: true, maxlength: 3},
    picLoc: {data: Buffer, contentType: String}
});

ItemSchema.virtual("url").get(function () {
    return "/items/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);