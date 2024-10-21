
const createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');

const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const findSubDoc = require("../findSubDoc.js");

const eventValidator = require("../validators/eventValidator");

class InsertForm extends Form {
	schara = true;
	scost  = true;
	price  = true;
}

// bascially the same as event
// check the docs of eventController
// begs to make a generic reusable file

exports.get_insert = [
	(req, res, next) => {
		Costume.find(function (err, docs) {
			if (err) next(createError(500, err));
			let insertEvent = new InsertForm();
			insertEvent.setData(docs);
			res.render('unifiedForm', { form: insertEvent });
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
				let insertPrice = new InsertForm();
				insertPrice.setData(docs);
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					insertPrice.setError(errors.array());
					return res.render("unifiedForm", { form: insertPrice });
				}

				let selectedChara = docs.find(i => i._id.toString() === req.body._id);
				if (!selectedChara) return next(createError(404, "no chara"));

				let selectedCostume = selectedChara.costumes.find(i => i._id.toString() === req.body.costumes[0]._id);
				if (!selectedCostume) return next(createError(404, "no costume"));

				await selectedChara.updateOne(
					{ "$push": { "costumes.$[costId].price": req.body.costumes[0].price[0] } },
					{
						"arrayFilters":
							[{ "costId._id": req.body.costumes[0]._id }]
					},
					(err, changes) => {
						if (err) throw err;
						res.redirect(`/costumes/${req.body._id}/${req.body.costumes[0]._id}`);
					}
				);
			})
	},
];

exports.get_update = [
	(req, res, next) => {
		let insertall = new Form();
		insertall.displayPrice();

		res.render('unifiedForm', { form: insertall });
	},
];


exports.update = [
	(req, res, next) => {
		req.body = req.body.costumes[0].price[0];
		Object.entries(req.body).forEach(([key, item]) => {
			if (item.length === 0) {
				delete req.body[key];
			}
		})
		next();
	},

	// TODO: NEED TO VALIDATE
	// TODO: USE/MAKE A REUSABLE FILE 

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
			return next(createError(400, errors.array()));
		}

		let oldData = await findSubDoc(Costume, req.params);
		if (oldData instanceof Error) return next(oldData);

		let [ character, oldPrice ] = oldData;

		let newPrice = { ...oldPrice, ...req.body, _id: req.params.price };

		await character.updateOne(
			{ "$set": { "costumes.$[costId].price.$[priceId]": newPrice } },
			{
				"arrayFilters":
					[{ "costId._id": req.params.costume }, { "priceId._id": req.params.price }]
			},
			(err, changes) => {
				if (err) throw err;
				res.redirect(`/costumes/${character.frameName}/${req.params.costume}`);
			}
		);
	},
];

exports.delete = [
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
		let oldData = await findSubDoc(Costume, req.params);

		if (oldData instanceof Error) return next(oldData);

		let [ character ] = oldData;
		await character.updateOne(
			{ "$pull": { "costumes.$[costId].price": { _id: req.params.price } } },
			{
				"arrayFilters":
					[{ "costId._id": req.params.costume }]
			},
			(err, changes) => {
				if (err) throw err;
				res.redirect(`/costumes/${character.frameName}/${req.params.costume}`);
			}
		);
	},
];