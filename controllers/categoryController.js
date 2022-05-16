const Category = require("../models/category");

exports.category_list = (req, res) => {
    res.send('NOT IMPLEMENTED: Category list');
}

exports.category_details = (req, res) => {
    res.send('NOT IMPLEMENTED: Category details: ' + req.params.id);
}

exports.category_add_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Category add GET');
}

exports.category_add_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Category add POST');
}

exports.category_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Category delete GET");
}

exports.category_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Category delete POST");
}

exports.category_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Category update GET");
}

exports.category_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Category update POST");
};
