var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, ) => {
  res.redirect(301, "./costumes")
});

module.exports = router;
