const express = require('express');
const util = require("util")
const createError = require('http-errors');
const {validationResult } = require('express-validator');
// const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

class allForm extends Form {
	chara   = true;
	costume = true;
	price   = true;
	event   = true;
}

exports.get = [
	(req, res, next) => {
		let insertAll = new allForm();
		insertAll.disableFields();
		res.render('unifiedForm', {form: insertAll});
	},
];

exports.insert = [
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

	charaValidator.insert,
	costumeValidator.insert,
	priceValidator.insert,
	eventValidator.all,

	async (req, res, next) => {
		const errors = validationResult(req);
		let insertAll = new allForm();
		insertAll.disableFields();

		if (!errors.isEmpty()) {
			insertAll.setError(errors.array());
			res.render("unifiedForm", {form: insertAll});
			// console.log(errors.array());
		}
		else {
			let doesCharaExist = await Costume.exists({frameName: req.body.frameName});
			if (!doesCharaExist) {
				let NewChara = new Costume(req.body);
				NewChara.save()
					.then(result => {
						insertAll.setSucc(result);
						res.render("unifiedForm", {form: insertAll})
					})
					.catch(err => next(createError(500, err)));
			}
		}
		// console.log(errors.array());
		// console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
		// res.redirect("back");
	}
];

exports.update = [

];

exports.delete = [
	
];