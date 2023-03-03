
const util = require("util")
const createError = require('http-errors');
const {validationResult } = require('express-validator');
	
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
		insertAll.disableFields(); // <= event is not required by default
		res.render('unifiedForm', {form: insertAll});
	},
];

exports.insert = [
	(req, res, next) => {
		// this is required for mongoose to run middleware, event is "-" if none specfied
		req.body.costumes.forEach(element => {
		  if  (!Array.isArray(element.event)) {
			element.event = [{}]; 
		  }
		});
		console.log("first", util.inspect(req.body, false, null, true /* enable colors */));
		next();
	},
	//run validaiton
	charaValidator.insert,
	costumeValidator.insert,
	priceValidator.insert,
	eventValidator.all,

	async (req, res, next) => {
		const errors = validationResult(req);
		let insertAll = new allForm();
		insertAll.disableFields();

		if (!errors.isEmpty()) {
			insertAll.setError(errors.array()); //specfiy the error
			res.render("unifiedForm", {form: insertAll}); //send the user back to form with errors displayed 
		}
		else {
			// name of the frame ie specific chara can't double
			let doesCharaExist = await Costume.exists({frameName: req.body.frameName});
			if (!doesCharaExist) {
				let NewChara = new Costume(req.body);
				NewChara.save()
					.then(result => {
						//display inserted data with a link to the new chara
						insertAll.setSucc(result);
						// and send back to the form
						res.render("unifiedForm", {form: insertAll})
					})
					.catch(err => next(createError(500, err)));
			}
			// TODO: THROW AN ERROR!
		}
		// console.log(errors.array());
		// console.log("second", util.inspect(req.body, false, null, true /* enable colors */));
		// res.redirect("back");
	}
];

exports.update = [
	//updating entire documents not necessary
	(req, res, next) => {
		res.render("unavailable");
	},
];

exports.delete = [
	// cannot delete entire charas
	(req, res, next) => {
		res.render("unavailable");
	},
];