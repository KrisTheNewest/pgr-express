var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');
const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

exports.get = [
	// (req, res, next) => {
	// 	res.render("notimplemented");
	// },
	(req, res, next) => {
		let insertall = new Form();
		// insertall.chooseChara();
		insertall.displayPrice();

		res.render('unifiedForm', {form: insertall});
	},
];

exports.insert = [
	(req, res, next) => {
		res.redirect("back");
		console.log("og body", req.body);
		// req.body = req.body.costumes[0].price[0];
		// Object.entries(req.body).forEach(([key, item]) => {
		// 	if	(item.length === 0) {
		// 		delete req.body[key];
		// 	}
		// })
		// console.log("filtered", req.body);
		next();
	},
];

exports.update = [
	(req, res, next) => {
		// let filtered = Object.fromEntries(
		req.body = req.body.costumes[0].price[0];
		Object.entries(req.body).forEach(([key, item]) => {
			if	(item.length === 0) {
				delete req.body[key];
			}
		})
		next();
	},	

	param("chara", "need a valid chara ID")
		.isMongoId(),
	param("costume", "need a valid costume ID")
		.isMongoId(),
	param("price", "need a valid price ID")
		.isMongoId(),
	
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors.array());
			return next(createError(500, errors.array()));
		}
		
		function findPrice () {
			return Costume.findById(req.params.chara)
				.then(chara => {
					if (!chara) return createError(404, "no chara");
					let costume = chara.costumes.id(req.params.costume);
					
					if (!costume) return createError(404, "no costume");
					let price = costume.price.id(req.params.price);

					if (!price) return createError(404, "no price");

					return chara;
				})
				.catch(err => createError(500, err));

			// let value;
			// Costume.findById(req.params.chara)
			// 	.then(chara => {
			// 		if (!chara) throw createError(404, "no chara");
			// 		value = chara;
			// 		return chara.costumes.id(req.params.costume);
			// 	})
			// 	.then(costume => {
			// 		if (!costume) throw createError(404, "no costume");
			// 		return chara.costumes.id(req.params.costume);
			// 	})
			// 	.then(price => {
			// 		if (!price) throw createError(404, "no price");
			// 		return value;
			// 	})
			// 	.catch(err => err.status !== 404 ? createError(500, err) : err );
		}
		let foundCostume = await findPrice();
		console.log(req.body);
		if (foundCostume instanceof Error) return next(foundCostume);
		let extractPrice = req.body.costumes[0].price[0];
		await foundCostume.updateOne(
			{ "$set": { "costumes.$[costId].price.$[priceId]": {...extractPrice, _id: req.params.price}}},
			{ "arrayFilters": 
				[{"costId._id": req.params.costume }, {"priceId._id": req.params.price}]
			},
			
			(err, idk) => { 
				if (err) throw err;
				// console.log(idk)
				res.redirect("back");
				// console.log(foundCostume.costumes[0].price[0]);
			}
		);
		// await foundCostume.save()
		// .then(() => {
		// 	console.log("success?");
		// 	res.redirect("back");
		// })
		// .catch(err => console.error(err));
			// foundCostume.updateOne(
			// 	// { "frameName" : "Zero" }, 
			// 	{"charaName": "help me"}
			// , 
			// (err, idk) => {
			// 	if (err) throw err;
			// 	console.log(idk)
			// }
			// );
			// console.log(util.inspect(foundCostume, false, null, true /* enable colors */));
		/*
		{ 
		"$set": {[`rosters.$[outer].schedule.${editDay}.${startPerieod}`]: value} 
		},
		{ 
		"arrayFilters": [{ "outer._id": roasterId }]
		},
		*/
		// 	{
		// 	costumes: [{
		// 		_id: req.params.costume,
		// 		price: {
		// 			_id: req.params.price,
		// 			...extractPrice,
		// 		}
		// 	}]
		// }


		
		
	},
	// (req, res, next) => {
	// 	res.redirect("back");
	// },
];

exports.delete = [
	
];