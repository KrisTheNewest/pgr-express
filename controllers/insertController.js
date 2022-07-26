var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const logger = require("../logger.js");

const Costume = require("../charasSchema.js");

exports.insert_all = [
	(req, res, next) => {
		req.body.costumes.forEach(element => {
		  if  (!Array.isArray(element.event)) {
			element.event = [{}];
		  }
		});
		// req.body = {"hello": [{"hi": "123"}, {"hi": "321"}]};
		console.log("first", util.inspect(req.body, false, null, true /* enable colors */));
		next();
	},
	// body("hello").isArray({min: 1}),
	// body("hello.*.").trim().escape(),
    body("frameName", "need a frame name").trim().isLength({ min: 1 }).escape(),
    body("charaName", "need a chara name").trim().isLength({ min: 1 }).escape(),

    body("costumes", "need a costume lol").isArray({min: 1}),
    body("costumes.*.skinName", "need a costume name").trim().isLength({ min: 1 }).escape(),

	body("costumes.*.price", "need a price").isArray({min: 1}),
		body("costumes.*.price.*.value")
			.if(body("costumes.*.price.*.currency").exists({checkFalsy: true}))
			.trim().notEmpty().withMessage("gib price").isInt().withMessage("not a valid number").toInt(),
		body("costumes.*.price.*.currency")
			.if(body("costumes.*.price.*.value").exists({checkFalsy: true}))
			.isIn(["RC", "BC", "CB", "¥"]).withMessage("pick a currency: RC, BC, CB, ¥"),
		body("costumes.*.price.*.name")
			.if(body("costumes.*.price.*.value").not().exists({checkFalsy: true}))
			.trim().isLength({ min: 1 }).withMessage("If no price is provided a message is required").escape(),

	body("costumes.*.event").optional().isArray({min: 1}),
		body("costumes.*.event.*.start")
			.optional({checkFalsy: true}).isDate().withMessage("not a valid date").toDate(),
		body("costumes.*.event.*.finish")
			.optional({checkFalsy: true}).isDate().withMessage("not a valid date").toDate(),
		body("costumes.*.event.*.rerun")
			.optional().isBoolean().withMessage("pls just check and dont modify html").toBoolean(),
		body("costumes.*.event.*.disc")
			.optional().isBoolean().withMessage("pls just check and dont modify html").toBoolean(),
		body("costumes.*.event.*.name")
			.optional().trim().isLength({ min: 1 }).withMessage("string pls").escape(),
		body("costumes.*.price.*.region")
			.if(body("costumes.*.price.*.start").exists({checkFalsy: true}))
			.isIn(["CN", "JP", "EN"]).withMessage("If a date is provided, please provide the region too"),

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("insert", {errorData: errors.array()});
			// console.log(errors.array());
		}
		else {
			let doesCharaExist = await Costume.exists({frameName: req.body.frameName});
			if (!doesCharaExist) {
				let NewChara = new Costume(req.body);
				NewChara.save()
					.then(result => res.render("insert", {newData: result}))
					.catch(err => next(createError(500, err)));
				// NewChara.save((err, ) => {
				// 	if (err) return logger.error(err);
				// 	;
				// });
			}
		}
		// console.log(errors.array());
		// console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
		// res.redirect("back");
	}
];
exports.insert_costume = [
	(req, res, next) => {
		req.body.costumes.forEach(element => {
		  if  (!Array.isArray(element.event)) {
			element.event = [{}];
		  }
		});
		// req.body = {"hello": [{"hi": "123"}, {"hi": "321"}]};
		console.log("first", util.inspect(req.body, false, null, true /* enable colors */));
		next();
	},

	body("frameName", "need a frame name").trim().isLength({ min: 1 }).escape(),
    body("costumes", "need a costume lol").isArray({min: 1}),
    body("costumes.*.skinName", "need a costume name").trim().isLength({ min: 1 }).escape(),

	body("costumes.*.price", "need a price").isArray({min: 1}),
		body("costumes.*.price.*.value")
			.if(body("costumes.*.price.*.currency").exists({checkFalsy: true}))
			.trim().notEmpty().withMessage("gib price").isInt().withMessage("not a valid number").toInt(),
		body("costumes.*.price.*.currency")
			.if(body("costumes.*.price.*.value").exists({checkFalsy: true}))
			.isIn(["RC", "BC", "CB", "¥"]).withMessage("pick a currency: RC, BC, CB, ¥"),
		body("costumes.*.price.*.name")
			.if(body("costumes.*.price.*.value").not().exists({checkFalsy: true}))
			.trim().isLength({ min: 1 }).withMessage("If no price is provided a message is required").escape(),

	body("costumes.*.event").optional().isArray({min: 1}),
		body("costumes.*.event.*.start")
			.optional({checkFalsy: true}).isDate().withMessage("not a valid date").toDate(),
		body("costumes.*.event.*.finish")
			.optional({checkFalsy: true}).isDate().withMessage("not a valid date").toDate(),
		body("costumes.*.event.*.rerun")
			.optional().isBoolean().withMessage("pls just check and dont modify html").toBoolean(),
		body("costumes.*.event.*.disc")
			.optional().isBoolean().withMessage("pls just check and dont modify html").toBoolean(),
		body("costumes.*.price.*.name")
			.optional().trim().isLength({ min: 1 }).withMessage("string pls").escape(),
		body("costumes.*.price.*.region")
			.if(body("costumes.*.price.*.start").exists({checkFalsy: true}))
			.isIn(["CN", "JP", "EN"]).withMessage("If a date is provided, please provide the region too"),
	
	(req, res, next) => {
		Costume.find()
			.then(docs => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.render("insertcostume", {errorData: errors.array(), names: docs});
				}
				let selectedChara = docs.find(i => i._id.toString() === req.body.frameName);
				//need a btter solution
				// req.body.costumes.forEach(i => )
				if (!selectedChara.costumes.some(item => item.skinName === req.body.costumes[0].skinName)) {
					selectedChara.costumes.push(...req.body.costumes);
					// let newDoc = selectedChara.costumes[2];
					// console.log(newDoc);
					// console.log(newDoc.isNew);
					// let findChara = docs.find(i => i._id.toString() === req.body.frameName);
					let atrocity = {}
					atrocity.frameName = selectedChara.frameName;
					atrocity.charaName = selectedChara.charaName;
					atrocity.costumes = [selectedChara.costumes.at(-1)];
					// console.log(atrocity)
					selectedChara.save()
						.then(() => res.render("insertcostume", {newData: atrocity, names: docs}))
						.catch(err => next(createError(500, err)));
				}
			});
	}
];
exports.insert_price = [
	// body("price", "need a price").isArray({min: 1}),
	// 	body("price.*.value")
	// 		.if(body("price.*.currency").exists({checkFalsy: true}))
	// 		.trim().notEmpty().withMessage("gib price").isInt().withMessage("not a valid number").toInt(),
	// 	body("price.*.currency")
	// 		.if(body("price.*.value").exists({checkFalsy: true}))
	// 		.isIn(["RC", "BC", "CB", "¥"]).withMessage("pick a currency: RC, BC, CB, ¥"),
	// 	body("price.*.name")
	// 		.if(body("price.*.value").not().exists({checkFalsy: true}))
	// 		.trim().isLength({ min: 1 }).withMessage("If no price is provided a message is required").escape(),
	// (req, res, next) => {

	// 	Costume.find( function (err, docs) {
	// 		if (err) next(createError(500, err));
	// 		const errors = validationResult(req);
	// 		if (!errors.isEmpty()) {
	// 			res.render("insert", {errorData: errors.array(), names: docs});
	// 		}
	// 		else {
	// 			res.render("insert", {newData: req.body, names: docs});
	// 		}
	// 	}).lean();

	// 	// console.log(errors.array());
	// 	console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
	// 	// res.redirect("back");
	// }
	(req, res, next) => {
		res.render("notimplemented");
	}
];
exports.insert_event = [
	// body("event").optional().isArray({min: 1}),
	// 	body("event.*.start")
	// 		.optional({checkFalsy: true}).isDate().withMessage("not a valid date").toDate(),
	// 	body("event.*.finish")
	// 		.optional({checkFalsy: true}).isDate().withMessage("not a valid date").toDate(),
	// 	body("event.*.rerun")
	// 		.optional().isBoolean().withMessage("pls just check and dont modify html").toBoolean(),
	// 	body("event.*.disc")
	// 		.optional().isBoolean().withMessage("pls just check and dont modify html").toBoolean(),
	// 	body("event.*.name")
	// 		.optional().trim().isLength({ min: 1 }).withMessage("string pls").escape(),
	// 	body("price.*.region")
	// 		.if(body("price.*.start").exists({checkFalsy: true}))
	// 		.isIn(["CN", "JP", "EN"]).withMessage("If a date is provided, please provide the region too"),
	// (req, res, next) => {
	// 	const errors = validationResult(req);
	// 	if (!errors.isEmpty()) {
	// 		res.render("insert", {errorData: errors.array()});
	// 	}
	// 	else {
	// 		res.render("insert", {newData: req.body});
	// 	}
	// 	// console.log(errors.array());
	// 	console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
	// 	// res.redirect("back");
	// }
	(req, res, next) => {
		res.render("notimplemented");
	}
];