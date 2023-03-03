const express = require('express');
const router = express.Router();
const allController = require("../controllers/allController");
const charaController = require("../controllers/charaController");
const costumeController = require("../controllers/costumeController");
const priceController = require("../controllers/priceController");
const eventController = require("../controllers/eventController");

//TODO: add redirecting
router.post('/', allController.delete);

//TODO: add redirecting
router.post('/chara/:chara', charaController.delete);

//TODO: CHANGE TO IDS NOT NAMES!!!!!!!!!!!!!!!!!!

router.post('/costume/:chara/:costume', costumeController.delete);

router.post('/price/:chara/:costume/:price', priceController.delete);

router.post('/event/:chara/:costume/:event', eventController.delete);

module.exports = router;
