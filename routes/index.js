const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

router.get("/", item_controller.index);

router.get("/items/add", item_controller.item_add_get);

router.post("/items/add", item_controller.item_add_post);

router.get("/items/:id/delete", item_controller.item_delete_get);

router.post("/items/:id/delete", item_controller.item_delete_post);

router.get("/items/:id/update", item_controller.item_update_get);

router.post("/items/:id/update", item_controller.item_update_post);

router.get("/items/:id", item_controller.item_details);

router.get("/items", item_controller.items_list);


router.get("/categories/add", category_controller.category_add_get);

router.post("/categories/add", category_controller.category_add_post);

router.get("/categories/:id/delete", category_controller.category_delete_get);

router.post("/categories/:id/delete", category_controller.category_delete_post);

router.get("/categories/:id/update", category_controller.category_update_get);

router.post("/categories/:id/update", category_controller.category_update_post);

router.get("/categories/:id", category_controller.category_details);

router.get("/categories", category_controller.category_list);



module.exports = router;
