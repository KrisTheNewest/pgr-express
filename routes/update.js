var express = require('express');
var router = express.Router();
var controller = require("../controllers/updateController.js");

const Costume = require("../charasSchema.js");

router.get('/', function(req, res, next) {
  // console.log(req)
  res.render('insert');
});
router.get('/chara/:chara', function(req, res, next) {
  Costume.findOne({"frameName" : req.params.chara}, function(err, frame) {
    if (err) next(createError(500, err));
   // console.log(frame)
   if (frame === null) return next(createError(404, 'No character found!')); //
   res.render("update", {cost: frame}); //(frame.costumes.id(req.params.costume)===null) ? throw  : req.body.genre,
   // res.send()
 });
});
router.get('/price', function(req, res, next) {
  res.render("notimplemented");
});
router.get('/event', function(req, res, next) {
  res.render("notimplemented");
});


// router.post('/', controller.update_all);
router.post('/chara/:chara', controller.update_chara);
// router.post('/costume', controller.update_costume);
// router.post('/price', controller.update_price);
// router.post('/event', controller.update_event);

// router.post('/character/:id/update', controller.insert_all);
// router.post('/costume/:id/update', controller.insert_all);
// router.post('/price/:id/update', controller.insert_all);
// router.post('/event/:id/update', controller.insert_all);
//magic.krystina.dev/insert/costume/12345667
module.exports = router;
