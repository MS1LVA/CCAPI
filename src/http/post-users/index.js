'use strict';

const configEnv = process.env.NODE_ENV || 'local',
	config = require('@architect/shared/config')(configEnv),
	headers = config.get('api.response.headers.default', {}),
	{ sleep, encryptToken } = require('@architect/shared/utility')(config),
	arc = require('@architect/functions'),
	Redis = require('@architect/shared/redis')(config),
	session = require('@architect/shared/session')(encryptToken, Redis, config),
	user = require('@architect/shared/user')(session, sleep),
	validateInput = require('@architect/shared/validate');

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
		headers,
		body: JSON.stringify({
			success: true
		}),
		statusCode: 200
	};
}

exports.handler = arc.http.async(route);
