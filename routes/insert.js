var express = require('express');
var router = express.Router();
var controller = require("../controllers/insertController.js");

const Costume = require("../charasSchema.js");

router.get('/', function(req, res, next) {
  // console.log(req)
  res.render('insert');
});
router.get('/costume', function(req, res, next) {
  Costume.find( function (err, docs) {
    if (err) next(createError(500, err));
    res.render("insertcostume", {names: docs});
  }).lean();
});
router.get('/price', function(req, res, next) {
  res.render("notimplemented");
});
router.get('/event', function(req, res, next) {
  res.render("notimplemented");
});


router.post('/', controller.insert_all);
router.post('/costume', controller.insert_costume);
router.post('/price', controller.insert_price);
router.post('/event', controller.insert_event);

// router.post('/character/:id/update', controller.insert_all);
// router.post('/costume/:id/update', controller.insert_all);
// router.post('/price/:id/update', controller.insert_all);
// router.post('/event/:id/update', controller.insert_all);
//magic.krystina.dev/insert/costume/12345667
module.exports = router;
