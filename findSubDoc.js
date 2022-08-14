
// const newError = (msg, code) => {
// 	const err = new Error(msg);
// 	err.status = code;
// 	return err;
// }

const createError = require("http-errors");

module.exports = function findSubDoc(Schema, params) {
	// console.log(arguments)
	return Schema.findById(params.chara)
		.then(chara => {
			if (!chara) return createError(404, "no chara" );
			let costume = chara.costumes.id(params.costume);
		
			if (!costume) return createError(404, "no costume");
			let deepSubDoc = params.price ? costume.price : costume.event;

			deepSubDoc = deepSubDoc.id(params.price || params.event);

			if (!deepSubDoc) return createError(404, params.price ? "no price" : "no event");
		
			return [chara, deepSubDoc.toObject()];
		})
		.catch(err => createError(500, err));
}