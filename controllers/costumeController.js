
const util = require("util")
const createError = require('http-errors');
const { validationResult, param, body } = require('express-validator');

const findSubDoc = require("../findSubDoc.js");

const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

class charaForm extends Form {
	// select  = true;
	costume = true;
	price   = true;
	event   = true;
}

// the insert pages/routes allow you choosing the chara/costume on the go
// and thus need to query first (no ajax needed)
exports.get_insert = [
	(req, res, next) => {
		Costume.find(function (err, docs) {
			if (err) next(createError(500, err));
			let insertCostume = new charaForm();
			insertCostume.selectChara();
			insertCostume.setData(docs);
			res.render('unifiedForm', { form: insertCostume });
		}).lean();
	},
];

exports.insert = [
	(req, res, next) => {
		req.body.costumes.forEach(element => {
			if (!Array.isArray(element.event)) {
				element.event = [{}]; // just like all, allows running middleware
			}
		});
		next();
	},

	//TODO: use ID not name
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
					res.render("unifiedForm", { form: insertCostume });
				}
				else {
					// TODO: refactor
					// TODO: VALIDATE ID!!!!

					//check if selected chara exists
					let selectedChara = docs.find(i => i._id.toString() === req.body._id);
					// TODO: need a better solution
					// this works, but probably could use a loop eventaully
					// for multiple entries
					// req.body.costumes.forEach(i => )

					// check for costumes = skin names cannot double
					if (!selectedChara.costumes.some(item => item.skinName === req.body.costumes[0].skinName)) {

						//simply push the document to all existing costumes
						selectedChara.costumes.push(...req.body.costumes);

						const newCostume = {}
						newCostume.frameName = selectedChara.frameName;
						newCostume.charaName = selectedChara.charaName;
						newCostume.costumes  = [ selectedChara.costumes.at(-1) ];

						// redirects to form data and 
						// displays newly inserted data 
						selectedChara.save()
							.then(() => {
								insertCostume.chooseChara();
								insertCostume.setSuccess(newCostume);
								res.render("unifiedForm", { form: insertCostume });
							})
							.catch(err => next(createError(500, err)));
					}
				}
			});
	}
];

exports.get_update = [
	(req, res, next) => {
		let updateCostume = new Form();
		// updating a specific costume
		// only requires a costume
		updateCostume.displayCostume();
		res.render('unifiedForm', { form: updateCostume });
	},
];

exports.update = [

	(req, res, next) => {
		// since the form/template stays the same
		// the only need the costume from the form/obj
		//TODO: try automating this
		req.body = req.body.costumes[0];
		// Object.entries(req.body).forEach(([key, item]) => {
		// 	if	(item.length === 0) {
		// 		delete req.body[key]; 
		// 	}
		// })
		next();
	},
	//display just field 
	param("chara", "need a valid chara ID")
		.isMongoId(),
	param("costume", "need a valid costume ID")
		.isMongoId(),
	body("skinName", "need a costume name")
		.trim().isLength({ min: 1 })
		.escape(),
	// find if exists
	// loop over all costumes
	// loop over provided 
	// check if there any matches
	// check if the name doubles
	// squash the documents

	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let updateCostume = new Form();
				updateCostume.displayCostume();
				updateCostume.setError(errors.array());
			return res.render("unifiedForm", { form: updateCostume });
		}

		let oldData = await findSubDoc(Costume, req.params);
		if (oldData instanceof Error) return next(oldData);

		let [ character ] = oldData;
		//check if a name already exists = no doubles
		if (character.costumes.some(item => item.skinName === req.body.skinName))
			return next(createError(409));

		// as for the mongoose/mongodb, it needs to include specific fields
		// if the entire document with missing fields is sent
		// it will be overwritten 
		character.updateOne(
			{ "$set": { "costumes.$[costId].skinName": req.body.skinName } },
			{
				"arrayFilters":
					[{ "costId._id": req.params.costume },]
			},
			(err, changes) => {
				if (err) throw err;
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
	// deleting entire costumes is not allowed (as of yet?)
	(req, res, next) => {
		res.render("unavailable");
	},
];