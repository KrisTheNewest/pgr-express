const { body } = require('express-validator');

const insert = {
	arr: body("costumes.*.price", "need a price")
		.isArray({ min: 1 }),
	value: body("costumes.*.price.*.value")
		.if(body("costumes.*.price.*.currency").exists({ checkFalsy: true }))
		.trim().notEmpty().withMessage("gib price")
		.isInt().withMessage("not a valid number")
		.toInt(),
	currency: body("costumes.*.price.*.currency")
		.if(body("costumes.*.price.*.value").exists({ checkFalsy: true }))
		.isIn(["RC", "BC", "CB", "¥"]).withMessage("pick a currency: RC, BC, CB, ¥"),
	name: body("costumes.*.price.*.name")
		.if(body("costumes.*.price.*.value").not().exists({ checkFalsy: true }))
		.trim().isLength({ min: 1 }).withMessage("If no price is provided a message is required")
		.escape(),
};

const update = {
	arr: body("costumes.*.price")
		.optional()
		.isArray({ min: 1 }),
	value: body("costumes.*.price.*.value")
		.optional()
		.trim().notEmpty().withMessage("gib price")
		.isInt().withMessage("not a valid number")
		.toInt(),
	currency: body("costumes.*.price.*.currency")
		.optional()
		.isIn(["RC", "BC", "CB", "¥"]).withMessage("pick a currency: RC, BC, CB, ¥"),
	name: body("costumes.*.price.*.name")
		.optional()
		.trim().isLength({ min: 1 }).withMessage("If no price is provided a message is required")
		.escape(),
};

exports.insert = insert;
exports.update = update;

exports.allInsert = Object.values(insert);
exports.allUpdate = Object.values(update);