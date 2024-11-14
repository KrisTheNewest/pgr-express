
const createError = require('http-errors');
const { param, validationResult } = require('express-validator');

const { isValidObjectId, } = require("mongoose");

const Costume = require("../charasSchema.js");

exports.costume = [

	//just make sure the items are specified 
	//and dont contain anything sketchy
	param("chara", "not a valid chara")
		.trim().isLength({ min: 1 })
		.escape(),
	param("costume", "not a valid costume")
		.optional()
		.trim().isLength({ min: 1 })
		.escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors.array());
			return next(createError(400, errors.array()));
		}
		//allows finding a chara by either their name or ID
		//human readable + perma link + query redirects
		//TODO: add a database of fanTL names and nicknames
		let conditon = isValidObjectId(req.params.chara)
			? { "_id": req.params.chara }
			: { "frameName": req.params.chara };

		Costume.findOne(conditon, (err, frame) => {
			if (err) next(createError(500, err));

			if (frame === null) return next(createError(404, 'No character found!'));
			// if no ID is specified just display the first costume
			let costumeFindById = frame.costumes.id(req.params.costume) ?? frame.costumes[0];
			res.render("costume", { currCost: costumeFindById, allCost: frame });
		});
	},
]

exports.index = [
	//just pass the entire library for the main page
	(req, res, next) => {
		Costume.find((err, docs) => {
			if (err) next(createError(500, err));
			res.render("costumes", { names: docs });
		}).lean();
	}
]