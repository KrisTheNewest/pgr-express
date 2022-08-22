const express = require('express');
const util = require("util")
const createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');
const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const findSubDoc = require("../findSubDoc.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

class InsertForm extends Form {
	schara = true;
	scost  = true;
	event  = true;
}

exports.get_insert = [
	// (req, res, next) => {
	// 	res.render("notimplemented");
	// },
	(req, res, next) => {
		Costume.find( function (err, docs) {
			if (err) next(createError(500, err));
			let insertEvent = new InsertForm();
			insertEvent.setData(docs);
			res.render('unifiedForm', {form: insertEvent});
		}).lean();
	},
];

exports.insert = [

	body("_id", "need a valid chara ID")
		.isMongoId(),
	body("costumes.*._id", "need a valid costume ID")
		.isMongoId(),
	eventValidator.all,

	(req, res, next) => {
		Costume.find()
			.then(async docs => {
				let insertEvent = new InsertForm();
				insertEvent.setData(docs);
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					insertEvent.setError(errors.array());
					return res.render("unifiedForm", {form: insertEvent});
				}
				// let check = await findSubDoc(Costume, )
				let selectedChara = docs.find(i => i._id.toString() === req.body._id);
				if (!selectedChara) return next(createError(404, "no chara"));
				let selectedCostume = selectedChara.costumes.find(i => i._id.toString() === req.body.costumes[0]._id);
				if (!selectedCostume) return next(createError(404, "no costume"));
				await selectedChara.updateOne(
					// {"charaName": "Luna"}, 
					{ "$push":  {"costumes.$[costId].event": req.body.costumes[0].event[0]}},
					{ "arrayFilters": 
						[{"costId._id": req.body.costumes[0]._id}]
					},
					(err, changes) => { 
						if (err) throw err;
						//console.log(changes)
						res.redirect(`/costumes/${req.body._id}/${req.body.costumes[0]._id}`);
					}
				);
				// console.log(util.inspect(req.body, false, Infinity, true));
				// res.redirect("back");	
			})
	},
];

exports.get_update = [
	// (req, res, next) => {
	// 	res.render("notimplemented");
	// },
	(req, res, next) => {
		let updateEvent = new Form();
		updateEvent.displayEvent();
		res.render('unifiedForm', {form: updateEvent});
	},
];


exports.update = [
	(req, res, next) => {
		// let filtered = Object.fromEntries(
		req.body = req.body.costumes[0].event[0];
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
	param("price", "need a valid event ID")
		.isMongoId(),

	// TODO: NEED TO VALIDATE
	// TODO: USE/MAKE A REUSABLE FILE 
	
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors.array());
			return next(createError(500, errors.array()));
		}
		
		let oldData = await findSubDoc(Costume, req.params);//.then(data => data).catch(err => next(createError(err.status || 500, err)))
		// console.log(oldData);
		if (oldData instanceof Error) return next(oldData);
		// res.redirect("back");
		// return;
		// console.log(oldData);
		let [character, oldPrice] = oldData;
		// console.log(character)
		// console.log(oldPrice)
		let newPrice = {...oldPrice, ...req.body, _id: req.params.price};
		// console.log(newPrice)
		await character.updateOne(
			{ "$set": { "costumes.$[costId].price.$[priceId]": newPrice}},
			{ "arrayFilters": 
				[{"costId._id": req.params.costume }, {"priceId._id": req.params.price}]
			},
			
			(err, changes) => { 
				if (err) throw err;
				//console.log(changes)
				res.redirect(`/costumes/${character.frameName}/${req.params.costume}`);
			}
		);
	},
	// (req, res, next) => {
	// 	res.redirect("back");
	// },
];

exports.delete = [
	param("chara", "need a valid chara ID")
		.isMongoId(),
	param("costume", "need a valid costume ID")
		.isMongoId(),
	param("event", "need a valid event ID")
		.isMongoId(),
	async (req, res, next) => {
		// let filtered = Object.fromEntries(
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors.array());
			return next(createError(500, errors.array()));
		}
		let oldData = await findSubDoc(Costume, req.params);//.then(data => data).catch(err => next(createError(err.status || 500, err)))
		// console.log(oldData);
		if (oldData instanceof Error) return next(oldData);
		// res.redirect("back");
		// return;
		// console.log(oldData);
		let [character] = oldData;
		await character.updateOne(
			// {"charaName": "Luna"}, 
			{ "$pull":  {"costumes.$[costId].event": {_id: req.params.event}}},
			{ "arrayFilters": 
				[{"costId._id": req.params.costume}]
			},
			(err, changes) => { 
				if (err) throw err;
				//console.log(changes)
				res.redirect(`/costumes/${character.frameName}/${req.params.costume}`);
			}
		);
	},	
];