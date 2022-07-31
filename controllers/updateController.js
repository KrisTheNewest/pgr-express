var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const logger = require("../logger.js");


const Costume = require("../charasSchema.js");

exports.update_all = [

];
// exports.get_chara = [
// 	async (req, res, next) => {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			res.render("insert", {errorData: errors.array()});
// 			// console.log(errors.array());
// 		}
// 		else {
// 			let doesCharaExist = await Costume.exists({frameName: req.body.frameName});
// 			if (!doesCharaExist) {
// 				let NewChara = new Costume(req.body);
// 				NewChara.save()
// 					.then(result => res.render("insert", {newData: result}))
// 					.catch(err => next(createError(500, err)));
// 				// NewChara.save((err, ) => {
// 				// 	if (err) return logger.error(err);
// 				// 	;
// 				// });
// 			}
// 		}
// 		// console.log(errors.array());
// 		// console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
// 		// res.redirect("back");
// 	}
// ];
exports.update_chara = [
	(req, res, next) => {
		console.log("og body", req.body);
		// console.log("params", req.params.chara);
		next();
	},
    body("frameName", "need a frame name").if(body("charaName").not().exists({checkFalsy: true}))
		.trim().isLength({ min: 1 }).escape(),//
    body("charaName", "need a chara name").if(body("frameName").not().exists({checkFalsy: true}))
		.trim().isLength({ min: 1 }).escape(),
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect("back");
			console.log("errors", errors.array());
		}
		else {
			console.log("params", req.params.chara);
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
			let doesCharaExist = await Costume.exists({frameName: req.body.frameName});
			if (doesCharaExist) {
				next(createError(409, "frame with this name already exists"));
			}
			let filtered = Object.fromEntries(
				Object.entries(req.body).filter(([key, item]) => {
					  return item.length !== 0;
				   })
			  );
			Costume.findOneAndUpdate({frameName: req.params.chara}, filtered, (err, doc) => {
				if (err) throw err;

				console.log(doc)
				next();
			})

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
exports.update_costume = [

];
exports.update_price = [

];
exports.update_event = [

];