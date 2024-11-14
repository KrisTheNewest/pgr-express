const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController.js");

router.get('/calendar', (req, res) => {
  // console.log(req.params)
  res.send(`<img src=../images/calendar-2022327.jpg alt="stock photo of a calendar">`);
});

// TODO: possibly check for both id AND name + archival fan TL 
router.get("/:chara/:costume?", indexController.costume);

router.get('/', indexController.index);

module.exports = router;
