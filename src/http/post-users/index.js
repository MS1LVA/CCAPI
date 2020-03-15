'use strict';

const user = require('../../../lib/user'),
	arc = require('@architect/functions'),
	validateInput = require('../../../lib/validate');

exports.handler = async (req) => {
	const body = arc.http.helpers.bodyParser(req),
		validated = validateInput(body, {
			email: {
				email: true,
				presence: true
			},
			password: {
				type: 'string',
				presence: true,
				length: {
					minimum: 6
				}
			}
		});

	// Short-circuit on invalid input
	if (validated.errors.length) return {
		body: JSON.stringify({
			errors: validated.errors
		}),
		statusCode: 422
	};

	await user.create(body.email, body.password);

	return {
		body: JSON.stringify({
			success: true
		}),
		statusCode: 200
	};
};
