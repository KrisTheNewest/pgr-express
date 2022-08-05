var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const logger = require("../logger.js");
	
const Costume = require("../charasSchema.js");
const Form = require("../FormLayout.js");

const charaValidator = require("../validators/charaValidator");
const costumeValidator = require("../validators/costumeValidator");
const priceValidator = require("../validators/priceValidator");
const eventValidator = require("../validators/eventValidator");

exports.get = [
	(req, res, next) => {
		res.render("notimplemented");
	},
	// (req, res, next) => {
	// 	let insertall = new Form();
	// 	insertall.chooseChara();
	// 	insertall.displayEvent();
	// 	res.render('unifiedForm', {form: insertall});
	// },
];

exports.insert = [

];

exports.update = [

];

exports.delete = [
	
];