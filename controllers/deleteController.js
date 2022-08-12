const express = require('express');
const util = require("util")
const createError = require('http-errors');
const {validationResult } = require('express-validator');
// const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

exports.get = [
	(req, res, next) => {
		// res.render("delete", {name: })
	},
];