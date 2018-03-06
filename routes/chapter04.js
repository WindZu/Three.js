var express = require('express');
var router = express.Router();

/* GET chapter01 page. */
router.get('/', function(req, res, next) {
  res.render('chapter04', { title: 'Three.js-chapter04' });
});

module.exports = router;