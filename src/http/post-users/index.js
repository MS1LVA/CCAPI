'use strict';

const user = require('../../../lib/user'),
	arc = require('@architect/functions'),
	validateInput = require('../../../lib/validate');

const route = async (request) => {
	const { validated, errors } = validateInput(request.body, {
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
	if (errors.length) return {
		body: JSON.stringify({
			errors
		}),
		statusCode: 422
	};

	await user.create(validated.email, validated.password);

	return {
		body: JSON.stringify({
			success: true
		}),
		statusCode: 200
	};
};

exports.handler = arc.http.async(route);
