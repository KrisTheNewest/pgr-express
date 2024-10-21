
const createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');

const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const findSubDoc = require("../findSubDoc.js");

const eventValidator = require("../validators/eventValidator");

class InsertForm extends Form {
	schara = true;
	scost  = true;
	event  = true;
}

exports.get_insert = [
	(req, res, next) => {
		//ditto, choose on the fly, query first
		Costume.find(function (err, docs) {
			if (err) next(createError(500, err));
			let insertEvent = new InsertForm();
			insertEvent.setData(docs);
			res.render('unifiedForm', { form: insertEvent });
		}).lean();
	},
];

exports.insert = [

	//check for IDs of chosen chara and costume 
	//more reliable and easier than names
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
					return res.render("unifiedForm", { form: insertEvent });
				}
				// this might seem redundant because of findSubdoc
				// but it skips the extra query since we needed one to display data
				// so it just uses JS methods instead
				let selectedChara = docs.find(i => i._id.toString() === req.body._id);
				if (!selectedChara) return next(createError(404, "no chara"));

				let selectedCostume = selectedChara.costumes.find(i => i._id.toString() === req.body.costumes[0]._id);
				if (!selectedCostume) return next(createError(404, "no costume"));

				await selectedChara.updateOne(
					//just as metioned before, it possibly could use a loop?
					{ "$push": { "costumes.$[costId].event": req.body.costumes[0].event[0] } },
					{
						"arrayFilters":
							[{ "costId._id": req.body.costumes[0]._id }]
					},
					(err, changes) => {
						if (err) throw err;
						// redirect the user to the newly inserted character/costume
						res.redirect(`/costumes/${req.body._id}/${req.body.costumes[0]._id}`);
					}
				);
			})
	},
];

exports.get_update = [
	(req, res, next) => {
		let updateEvent = new Form();
		updateEvent.displayEvent();
		res.render('unifiedForm', { form: updateEvent });
	},
];


exports.update = [
	//TODO: add a loop n turn this into a reusable middleware 
	(req, res, next) => {
		req.body = req.body.costumes[0].event[0];
		Object.entries(req.body).forEach(([key, item]) => {
			if (item.length === 0) {
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

		let oldData = await findSubDoc(Costume, req.params);
		if (oldData instanceof Error) return next(oldData);

		let [ character, oldPrice ] = oldData;

		// the id is needed otherwise mongo will add a new one
		// reusing the old doc and overwriting changed values makes queries easier
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

// deleting is simple, check for the IDs, query the database if the target exists
// and then use the pull method to remove the subdoc

exports.delete = [
	param("chara", "need a valid chara ID")
		.isMongoId(),
	param("costume", "need a valid costume ID")
		.isMongoId(),
	param("event", "need a valid event ID")
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
			//pull removes en event from a nested docs/arrays 
			{ "$pull": { "costumes.$[costId].event": { _id: req.params.event } } },
			{
				"arrayFilters":
					[{ "costId._id": req.params.costume }]
			},
			(err, changes) => {
				if (err) throw err;
				// redirect back to the costume/frame
				res.redirect(`/costumes/${character.frameName}/${req.params.costume}`);
			}
		);
	},
];