const express = require('express');
const router = express.Router();
const allController = require("../controllers/allController");
// const charaController = require("../controllers/charaController");
const costumeController = require("../controllers/costumeController");
const priceController = require("../controllers/priceController");
const eventController = require("../controllers/eventController");

// landing page for adding entire new chara with costume
router.get('/', allController.get);
// handling post requests 
router.post('/', allController.insert);

// landing page for adding a new costume to existing chara
router.get('/costume', costumeController.get);
// handling post requests 
router.post('/costume', costumeController.insert);

// landing page for adding a new price to existing costume
router.get('/price', priceController.get);
// handling post requests 
router.post('/price', priceController.insert);

// landing page for adding a new event to existing costume
router.get('/event', eventController.get);
// handling post requests 
router.post('/event', eventController.insert);

module.exports = router;
