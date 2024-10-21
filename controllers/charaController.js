
const createError = require('http-errors');
const { param, validationResult } = require('express-validator');

const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");

exports.get = [
	(req, res, next) => {
		let insertall = new Form();
		insertall.displayChara();
		res.render('unifiedForm', { form: insertall });
	},
];

exports.insert = [
	//cannot insert a new chara without a costume
];

exports.update = [
	(req, res, next) => {
		// remove the empty values as they will overwrite exsiting ones
		Object.entries(req.body)
			.forEach(([key, item]) => {
				if (item.length === 0) {
					delete req.body[key];
				}
			})
		next();
	},
	//NEED TO CHECK PARAMS FOR ID
	//SINCE NAME CAN CHANGE ID WONT

	charaValidator.update,
	param("chara", "need a valid chara")
		.trim().isLength({ min: 1 })
		.isMongoId()
		.escape(),

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect("back");
		}
		else {
			//THIS NEEDS TO CHECK FOR FRAMENAME THATS BEING INSERTED
			//IT CANNOT DOUBLE
			let doesCharaExist = await Costume.exists({ frameName: req.body.frameName });
			if (doesCharaExist) { // might have gone a bit too far with some errors
				next(createError(409, "frame with this name already exists"));
			}

			Costume.findOneAndUpdate({ _id: req.params.chara }, req.body, (err, doc) => {
				if (err) throw err;
				next();
			});
		}
	},
	(req, res, next) => {
		// send the user to the newly updated chara
		res.redirect(`/costumes/${req.params.chara}`);
	},
];

exports.delete = [
	// cannot delete entire charas
	(req, res, next) => {
		res.render("unavailable");
	},
];