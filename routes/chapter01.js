var express = require('express');
var router = express.Router();

/* GET chapter01 page. */
router.get('/', function(req, res, next) {
  res.render('chapter01', { title: 'Three.js-chapter01' });
});

module.exports = router;