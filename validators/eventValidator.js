const { body } = require('express-validator');

exports.all = [
	body("costumes.*.event")
		.optional()
		.isArray({ min: 1 }),
	body("costumes.*.event.*.start")
		.optional({ checkFalsy: true })
		.isDate().withMessage("not a valid date")
		.toDate(),
	body("costumes.*.event.*.finish")
		.optional({ checkFalsy: true })
		.isDate().withMessage("not a valid date")
		.toDate(),
	body("costumes.*.event.*.rerun")
		.optional()
		.isBoolean().withMessage("pls just check and dont modify html")
		.toBoolean(),
	body("costumes.*.event.*.disc")
		.optional()
		.isBoolean().withMessage("pls just check and dont modify html")
		.toBoolean(),
	body("costumes.*.event.*.name")
		.optional()
		.trim().isLength({ min: 1 }).withMessage("string pls")
		.escape(),
	body("costumes.*.price.*.region")
		.if(body("costumes.*.price.*.start").exists({ checkFalsy: true }))
		.isIn(["CN", "JP", "EN"]).withMessage("If a date is provided, please provide the region too"),
];
