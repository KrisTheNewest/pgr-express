
const createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');
	
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
		Object.entries(req.body)
			.forEach(([key, item]) => {
				if	(item.length === 0) {
					delete req.body[key];
				}
			})
		console.log("filtered", req.body);
		next();
	},
	//TODO: NEED TO CHECK PARAMS
	//TODO: IT ICNLUDES ID NOT NAME
	//TODO: SICNE NAME CAN CHANGE ID WONT
	
	charaValidator.update,
	param("chara", "need a valid chara")
		.trim().isLength({ min: 1 })
		.isMongoId()
		.escape(),

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

			Costume.findOneAndUpdate({_id: req.params.chara}, req.body, (err, doc) => {
				if (err) throw err;

				console.log(doc);
				next();
			});
		}
	},
	(req, res, next) => {
		res.redirect(`/costumes/${req.params.chara}`);
	},
];

exports.delete = [
	// not possible
	(req, res, next) => {
		res.render("unavailable");
	},
];