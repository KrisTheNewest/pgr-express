const express = require('express');
const util = require("util")
const createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');
const logger = require("../logger.js");

const {isValidObjectId} = require("mongoose");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const findSubDoc = require("../findSubDoc.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");
//"/:chara/:costume"
exports.costume = [
	
	param("chara", "not a valid chara")
		.trim().isLength({ min: 1 })
		.escape(),
	param("costume", "not a valid costume")
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
		  let costumeFindById = frame.costumes.id(req.params.costume);
		  if (costumeFindById === null) return next(createError(404, 'No costume found!')); //
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