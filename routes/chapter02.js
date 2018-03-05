var express = require('express');
var router = express.Router();

/* GET chapter01 page. */
router.get('/', function(req, res, next) {
  res.render('chapter02', { title: 'Three.js-chapter02' });
});

module.exports = router;