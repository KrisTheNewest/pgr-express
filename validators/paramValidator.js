const { param } = require('express-validator');

exports.all = [
	param("chara", "need a valid chara ID")
	.isMongoId(),
	param("costume", "need a valid costume ID")
	.isMongoId(),
	param("price", "need a valid price ID")
	.isMongoId(),
];
