const { body } = require('express-validator');

const eventValidator = {
	arr: body("costumes.*.event")
		.optional()
		.isArray({ min: 1 }),
	start: body("costumes.*.event.*.start")
		.optional({ checkFalsy: true })
		.isDate().withMessage("not a valid date")
		.toDate(),
	finish: body("costumes.*.event.*.finish")
		.optional({ checkFalsy: true })
		.isDate().withMessage("not a valid date")
		.toDate(),
	rerun: body("costumes.*.event.*.rerun")
		.optional()
		.isBoolean().withMessage("pls just check and dont modify html")
		.toBoolean(),
	disc: body("costumes.*.event.*.disc")
		.optional()
		.isBoolean().withMessage("pls just check and dont modify html")
		.toBoolean(),
	name: body("costumes.*.event.*.name")
		.optional()
		.trim().isLength({ min: 1 }).withMessage("string pls")
		.escape(),
	region: body("costumes.*.price.*.region")
		.if(body("costumes.*.price.*.start").exists({ checkFalsy: true }))
		.isIn(["CN", "JP", "EN"]).withMessage("If a date is provided, please provide the region too"),
};

exports.insert = eventValidator;

exports.allInsert = Object.values(eventValidator);