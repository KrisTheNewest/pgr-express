var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const logger = require("../logger.js")

const Costume = require("../charasSchema.js");

//Set up default mongoose connection
// function create404(errMsg) {
//   let err404 = new Error(errMsg);
//   err404.status = 404;
//   return err404;
// }

// async function finder() {
//   Costume.find()
//   console.log(allCharas);
// }
// finder()
/* GET users listing. */
router.get('/calendar', function(req, res) {
  // console.log(req.params)
  res.send(`<img src=../images/calendar-2022327.jpg alt="stock photo of a calendar">`);
});
// TODO: MODIFY IT FOR ID!!!!!!!!!!!!!
// TODO: MODIFY IT FOR ID!!!!!!!!!!!!!
// TODO: MODIFY IT FOR ID!!!!!!!!!!!!!
// possibly check for both id AND name + archival fan TL 
router.get("/:chara/:costume", function(req, res, next) {
  // console.log(req.params)
  Costume.findOne({"frameName" : req.params.chara}, function(err, frame) {
     if (err) next(createError(500, err));
    // console.log(frame)
    if (frame === null) return next(createError(404, 'No character found!')); //
    let costumeFindById = frame.costumes.id(req.params.costume);
    if (costumeFindById === null) return next(createError(404, 'No costume found!')); //
    res.render("costume", {currCost: costumeFindById, allCost: frame}); //(frame.costumes.id(req.params.costume)===null) ? throw  : req.body.genre,
    // res.send()
  });
});
router.get('/', function(req, res, next) {
  Costume.find( function (err, docs) {
    if (err) next(createError(500, err));
    res.render("costumes", {names: docs});
  }).lean();
});

module.exports = router;
