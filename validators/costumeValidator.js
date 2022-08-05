const { body } = require('express-validator');

const insert = {
	arr: body("costumes", "need a costume lol")
		.isArray({ min: 1 }),
	skinName: body("costumes.*.skinName", "need a costume name")
		.trim().isLength({ min: 1 })
		.escape(),
};
const update = {
	arr: body("costumes", "need a costume lol")
		.isArray({ min: 1 }),
	skinName: body("costumes.*.skinName", "need a costume name")
		.trim().isLength({ min: 1 })
		.escape(),
};

exports.insert = insert;
exports.update = update;

exports.allInsert = Object.values(insert);
exports.allUpdate = Object.values(update);