const Item = require("../models/item");


exports.index = (req, res) => {
    res.render('index', {items: 16, categories: 4});
}

exports.items_list = (req, res) => {
    res.send('NOT IMPLEMENTED: Items list');
}

exports.item_details = (req, res) => {
    res.send('NOT IMPLEMENTED: Item details: ' + req.params.id);
}

exports.item_add_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Item add GET');
}

exports.item_add_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Item add POST');
}

exports.item_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Item delete GET");
}

exports.item_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Item delete POST");
}

exports.item_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Item update GET");
}

exports.item_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Item update POST");
};
