
const createError = require('http-errors');
const { param, validationResult } = require('express-validator');

const { isValidObjectId, } = require("mongoose");
	
const Costume = require("../charasSchema.js");

exports.costume = [
	
	param("chara", "not a valid chara")
		.trim().isLength({ min: 1 })
		.escape(),
	param("costume", "not a valid costume")
		.optional()
		.trim().isLength({ min: 1 })
		.escape(),

	function(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors.array());
			return next(createError(400, errors.array()));
		}
		let conditon = isValidObjectId(req.params.chara) 
					 ? {"_id": req.params.chara} 
					 : {"frameName" : req.params.chara};
		
		Costume.findOne(conditon, function(err, frame) {
		   if (err) next(createError(500, err));
		  // console.log(frame)
		  if (frame === null) return next(createError(404, 'No character found!')); //
		  let costumeFindById = frame.costumes.id(req.params.costume) ?? frame.costumes[0];
		  res.render("costume", {currCost: costumeFindById, allCost: frame}); //(frame.costumes.id(req.params.costume)===null) ? throw  : req.body.genre,
		  // res.send()
		});
	},
]

exports.index = [
	(req, res, next) => {
		Costume.find((err, docs) => {
		  if (err) next(createError(500, err));
		  res.render("costumes", {names: docs});
		}).lean();
	}
]