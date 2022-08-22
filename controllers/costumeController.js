var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const logger = require("../logger.js");

const findSubDoc = require("../findSubDoc.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

class charaForm extends Form {
	// select  = true;
	costume = true;
	price   = true;
	event   = true;
}

exports.get_insert = [
	(req, res, next) => {
		Costume.find( function (err, docs) {
			if (err) next(createError(500, err));
			let insertCostume = new charaForm();
			insertCostume.selectChara();
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
	//TODO: just use ID not name
	//TODO: why did i use names 
	costumeValidator.insert,
	priceValidator.insert,
	eventValidator.all,
	
	(req, res, next) => {
		Costume.find()
			.then(docs => {
				let insertCostume = new charaForm();
				insertCostume.setData(docs);
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					insertCostume.selectChara();
					insertCostume.setError(errors.array());
					res.render("unifiedForm", {form: insertCostume});
				}
				else {

					// TODO: MODIFY IT FOR ID!!!!!!!!!!!!!
					// TODO: USE MONGOOSE METHODS(?)
					// possibly would require multiple db queries

					//check if slected chara exists 
					let selectedChara = docs.find(i => i._id.toString() === req.body.frameName);
					// TODO: need a better solution
					// this works, but probably could use a loop eventaully
					// req.body.costumes.forEach(i => )

					// check for costumes = skin names cannot double
					if (!selectedChara.costumes.some(item => item.skinName === req.body.costumes[0].skinName)) {
						console.log(req.body.costumes);

						//simply push the document 
						selectedChara.costumes.push(...req.body.costumes);
						// let newDoc = selectedChara.costumes[2];
						// console.log(newDoc);
						// console.log(newDoc.isNew);
						// let findChara = docs.find(i => i._id.toString() === req.body.frameName);

						// i dunno if this is necesarry, maybe just do the data...?
						let atrocity = {}
						atrocity.frameName = selectedChara.frameName;
						atrocity.charaName = selectedChara.charaName;
						atrocity.costumes = [selectedChara.costumes.at(-1)];
						// console.log(atrocity)
						selectedChara.save()
							.then(() => {
								insertCostume.chooseChara();
								insertCostume.setSucc(atrocity);
								res.render("unifiedForm", {form: insertCostume})
							})
							.catch(err => next(createError(500, err)));
					}
				}
			});
	}
];

exports.get_update = [
	(req, res, next) => {
		// Costume.find( function (err, docs) {
		// 	if (err) next(createError(500, err));

			let updateCostume = new Form();
			updateCostume.displayCostume();
			// updateCostume.setData(docs);
			res.render('unifiedForm', {form: updateCostume});
		// }).lean();
	},
];

exports.update = [

	(req, res, next) => {
		// let filtered = Object.fromEntries(
		req.body = req.body.costumes[0]; //TODO: try automating this
		// Object.entries(req.body).forEach(([key, item]) => {
		// 	if	(item.length === 0) {
		// 		delete req.body[key]; 
		// 	}
		// })
		console.log(req.body)
		next();
	},	
	//display just field 
	costumeValidator.update,
	// find if exists
	// loop over all costumes
	// loop over provided 
	// check if there any matches
	// check if the name doubles
	// squash the documents


	async (req, res, next) => {
		// let doesCharaExist = await Costume.findById(req.params.chara);
		// if (!doesCharaExist) return next(createError(404));
		// let errors = [];
			//TODO: NEEDS CALLBACK
			let oldData = await findSubDoc(Costume, req.params);//.then(data => data).catch(err => next(createError(err.status || 500, err)))
			// console.log(oldData); 
			//TODO: NEEDS CALLBACK
			if (oldData instanceof Error) return next(oldData);
			// res.redirect("back");
			// return;
			// console.log(oldData);
			//TODO: NEEDS CALLBACK
			let [character] = oldData;
			if (character.costumes.some(item =>
				item.skinName === req.body.skinName)) return next(createError(409));
			// console.log(character)
			// console.log(oldPrice)

			await character.updateOne(
				{ "$set": { "costumes.$[costId].skinName": req.body.skinName}},
				{ "arrayFilters": 
					[{"costId._id": req.params.costume },]
				},
				
				(err, changes) => { 
					if (err) throw err;
					//console.log(changes)
					res.redirect(`/costumes/${character.frameName}/${req.params.costume}`);
				}
			);
		// req.body.costumes.forEach(reqCos => {
		// 	// if (!doesCharaExist.costumes.some(item => 
		// 	// 	item.skinName === reqCos.skinName)) { 

		// 	// 	}
		// 	doesCharaExist.costumes.forEach(costume => {
		// 		if (reqCos.skinName === costume.skinName) return /* error doubling name*/;

		// 		if (reqCos._id === costume._id) {
		// 			costume.skinName = reqCos.skinName;
		// 		}
		// 		else return// no costume
		// 	});
		// })

	},


];

exports.delete = [
	
];