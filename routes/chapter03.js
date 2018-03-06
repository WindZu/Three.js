var express = require('express');
var router = express.Router();

/* GET chapter01 page. */
router.get('/', function(req, res, next) {
  res.render('chapter03', { title: 'Three.js-chapter03' });
});

module.exports = router;