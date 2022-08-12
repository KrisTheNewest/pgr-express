const { body } = require('express-validator');

exports.insert = [
	body("costumes", "need a costume lol")
		.isArray({ min: 1 }),
	body("costumes.*.skinName", "need a costume name")
		.trim().isLength({ min: 1 })
		.escape(),
];

exports.update = [
	body("costumes", "need a costume lol")
		.isArray({ min: 1 }),
	body("costumes.*.skinName", "need a costume name")
		.trim().isLength({ min: 1 })
		.escape(),
];
