const express = require('express');
const router = express.Router();
const allController = require("../controllers/allController");
const charaController = require("../controllers/charaController");
const costumeController = require("../controllers/costumeController");
const priceController = require("../controllers/priceController");
const eventController = require("../controllers/eventController");

// landing page for updating entire chara
router.get('/', allController.get);
// handling post requests 
router.post('/', allController.update)

//CHANGE TO IDS NOT NAMES!!!!!!!!!!!!!!!!!!
// landing page for updating
router.get('/chara/:chara', charaController.get);
// handling post requests 
router.post('/chara/:chara', charaController.update);

// landing page for adding a new costume to existing chara
router.get('/costume/:chara/:costume', costumeController.get_update);
// handling post requests 
router.post('/costume/:chara/:costume', costumeController.update);

// landing page for adding a new price to existing costume
router.get('/price/:chara/:costume/:price', priceController.get_update);
// handling post requests 
router.post('/price/:chara/:costume/:price', priceController.update);

// landing page for adding a new event to existing costume
router.get('/event/:chara/:costume/:price', eventController.get_update);
// handling post requests 
router.post('/event/:chara/:costume/:price', eventController.update);

module.exports = router;











// router.get('/', function(req, res, next) {
//   // console.log(req)
//   res.render('insert');
// });
// router.get('/chara/:chara', function(req, res, next) {
//   Costume.findOne({"frameName" : req.params.chara}, function(err, frame) {
//     if (err) next(createError(500, err));
//    // console.log(frame)
//    if (frame === null) return next(createError(404, 'No character found!')); //
//    res.render("update", {cost: frame}); //(frame.costumes.id(req.params.costume)===null) ? throw  : req.body.genre,
//    // res.send()
//  });
// });
// router.get('/price', function(req, res, next) {
//   res.render("notimplemented");
// });
// router.get('/event', function(req, res, next) {
//   res.render("notimplemented");
// });


// // router.post('/', controller.update_all);
// router.post('/chara/:chara', controller.update_chara);
// // router.post('/costume', controller.update_costume);
// // router.post('/price', controller.update_price);
// // router.post('/event', controller.update_event);

// // router.post('/character/:id/update', controller.insert_all);
// // router.post('/costume/:id/update', controller.insert_all);
// // router.post('/price/:id/update', controller.insert_all);
// // router.post('/event/:id/update', controller.insert_all);
// //magic.krystina.dev/insert/costume/12345667
// module.exports = router;
