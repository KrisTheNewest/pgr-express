const { body } = require('express-validator');

const insert = {
	frameName: body("frameName", "need a frame name")
		.trim().isLength({ min: 1 })
		.escape(),
	charaName: body("charaName", "need a chara name")
		.trim().isLength({ min: 1 })
		.escape(),
};
const update = {
	frameName: body("frameName", "need a frame name")
		.optional()
		.trim().isLength({ min: 1 })
		.escape(),
	charaName: body("charaName", "need a chara name")
		.optional()
		.trim().isLength({ min: 1 })
		.escape(),
}
exports.insert = insert;
exports.update = update;

exports.allInsert = Object.values(insert);
exports.allUpdate = Object.values(update);