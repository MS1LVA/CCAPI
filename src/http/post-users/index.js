'use strict';

const user = require('../../../lib/user'),
	arc = require('@architect/functions'),
	validateInput = require('../../../lib/validate');

async function route(request) {
	const { validated, errors } = validateInput(request.body, {
		email: {
			email: true,
			presence: true
		},
		passphrase: {
			type: 'string',
			presence: true
		}
	});

	// Short-circuit on invalid input
	if (errors.length) return {
		body: JSON.stringify({
			errors
		}),
		statusCode: 422
	};

	await user.create(validated.email, validated.passphrase);

	return {
		body: JSON.stringify({
			success: true
		}),
		statusCode: 200
	};
}

exports.handler = arc.http.async(route);
