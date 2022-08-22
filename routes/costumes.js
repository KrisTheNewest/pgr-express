const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController.js");
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
router.get("/:chara/:costume", indexController.costume);
router.get('/', indexController.index);

module.exports = router;
