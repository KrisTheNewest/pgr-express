var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');
const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");

exports.get = [
	(req, res, next) => {
		let insertall = new Form();
		insertall.displayChara();
		res.render('unifiedForm', {form: insertall});
	},
];

exports.insert = [
//not possible
];

exports.update = [
	(req, res, next) => {
		console.log("og body", req.body);
		// let filtered = Object.fromEntries(
		Object.entries(req.body).forEach(([key, item]) => {
			if	(item.length === 0) {
				delete req.body[key];
			}
		})
		console.log("filtered", req.body);
		next();
	},
	//NEED TO CHECK PARAMS
	//IT ICNLUDES ID NOT NAME
	//SICNE NAME CAN CHANGE ID WONT
	
	charaValidator.update,

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect("back");
			console.log("errors", errors.array());
		}
		else {
			console.log("params", req.params.chara);
			//THIS NEEDS TO CHECK FOR FRAMENAME THATS BEING INSERTED
			//NOT FOR THE ID FROM PARAMS!!!!!!!!!!!!!!!!!!!!!!!!!!
			let doesCharaExist = await Costume.exists({frameName: req.body.frameName});
			if (doesCharaExist) {
				next(createError(409, "frame with this name already exists"));
			}

			Costume.findOneAndUpdate({frameName: req.params.chara}, req.body, (err, doc) => {
				if (err) throw err;

				console.log(doc);
				next();
			});

			// Costume.findOne({frameName: req.body.frameName})
			// .then(chara => {
			// 	if (chara) 
			// 	Object.entries(req.body).forEach(([key, item]) => {
			// 		console.log("key", key)
			// 		console.log("item", item)
			// 		// console.log("here", chara[key])
			// 	})
			// })
			// .catch()
			// Costume.findOneAndUpdate({frameName: req.body.frameName}, )
			// param("chara", "need a chara to update").isMongoId().custom(id => {
			// 	return Costume.exists({frameName: req.body.frameName})
			// })

			// Costume.findOne({frameName: req.params.chara})
			// 	.then(doc => {
			// 		let filtered = Object.fromEntries(
            // 			Object.entries(req.body).filter(([key, item]) => {
            //  			 	return item.length !== 0 && doc[key] !== item;
           	// 			})
          	// 		);
			// 		// doc = {...doc, ...filtered};
			// 		console.log(doc);
			// 		console.log(filtered)
			// 		next();
			// 	})
			// 	NewChara.save()
			// 		.then(result => res.render("insert", {newData: result}))
			// 		.catch(err => next(createError(500, err)));
			// 	// NewChara.save((err, ) => {
			// 	// 	if (err) return logger.error(err);
			// 	// 	;
			// 	// });
			// }
		}
		// console.log(errors.array());
		// console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
		// res.redirect("back");
	},
	(req, res, next) => {
		res.redirect("back");
	},
];

exports.delete = [
	// not possible
	(req, res, next) => {
		res.render("unavailable");
	},
];