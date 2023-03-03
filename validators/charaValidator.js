const { body } = require('express-validator');

exports.insert = [
	body("frameName", "need a frame name")
		.trim().isLength({ min: 1 })
		.escape(),
	body("charaName", "need a chara name")
		.trim().isLength({ min: 1 })
		.escape(),
];

exports.update = [
	body("frameName", "need a frame name")
		.optional()
		.trim().isLength({ min: 1 })
		.escape(),
	body("charaName", "need a chara name")
		.optional()
		.trim().isLength({ min: 1 })
		.escape(),
];
