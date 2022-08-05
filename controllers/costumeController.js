var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

class charaForm extends Form {
	select  = true;
	costume = true;
	price   = true;
	event   = true;
}

exports.get = [
	(req, res, next) => {
		Costume.find( function (err, docs) {
			if (err) next(createError(500, err));
			let insertCostume = new charaForm();
			insertCostume.setData(docs);
			res.render('unifiedForm', {form: insertCostume});
		}).lean();
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

	//TODO: I AM STUPID
	//just use ID not name
	//why did i use names 
	charaValidator.insert.frameName,
	costumeValidator.allInsert,
	priceValidator.allInsert,
	eventValidator.allInsert,
	(req, res, next) => {
		Costume.find()
			.then(docs => {
				let insertCostume = new charaForm();
				insertCostume.setData(docs);
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					insertCostume.setError(errors.array());
					res.render("unifiedForm", {form: insertCostume});
				}
				else {
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
							.then(() => {
								insertCostume.setSucc(atrocity);
								res.render("unifiedForm", {form: insertCostume})
							})
							.catch(err => next(createError(500, err)));
					}
				}
			});
	}
];

exports.update = [

];

exports.delete = [
	
];