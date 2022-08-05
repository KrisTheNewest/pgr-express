var express = require('express');
var util = require("util")
var createError = require('http-errors');
const { body, param, validationResult } = require('express-validator');
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
	// 	insertall.displayPrice();

	// 	res.render('unifiedForm', {form: insertall});
	// },
];

exports.insert = [
	(req, res, next) => {
		console.log("og body", req.body);
		// let filtered = Object.fromEntries(
		Object.entries(req.body).forEach(([key, item]) => {
			if	(item.length === 0) {
				delete req.body[key];
			}
		})
		console.log("filtered", req.body);
		next();
	},
	param("chara"),
	param("costume"),
	param("price"),
];

exports.update = [

];

exports.delete = [
	
];