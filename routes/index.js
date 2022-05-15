const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {items: 16, categories: 4});
});

module.exports = router;
