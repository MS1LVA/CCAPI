'use strict';

const validate = require('validate.js');

function validateInput(subject, constraints) {
	const returner = {
			validated: {
			},
			errors: []
		},
		duped = {
			...subject
		},
		result = validate(duped, constraints);
	if (result) {
		for (const key in result) {
			returner.errors.push({
				message: `"${key}": ${result[key]}`
			});
		}
	}
	for (const key in constraints) {
		returner.validated[key] = subject[key];
	}
	Object.freeze(returner);
	return returner;
}

module.exports = validateInput;
