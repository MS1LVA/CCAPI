'use strict';

const configEnv = process.env.NODE_ENV || 'local',
	config = require('@architect/shared/config')(configEnv),
	headers = config.get('api.response.headers.default', {}),
	{ sleep, encryptToken } = require('@architect/shared/utility')(config),
	arc = require('@architect/functions'),
	Redis = require('@architect/shared/redis')(config),
	session = require('@architect/shared/session')(encryptToken, Redis, config),
	{ authenticate } = require('@architect/shared/user')(session, sleep),
	validateInput = require('@architect/shared/validate');

async function route(request) {
	try {
		const { validated, errors } = validateInput(request.body, {
			email: {
				email: true,
				presence: true
			},
			passphrase: {
				type: 'string',
				presence: true,
				length: {
					minimum: 6
				}
			}
		});

		// Short-circuit on bad input
		if (errors && errors.length) return {
			statusCode: 422,
			body: JSON.stringify({
				errors
			})
		};

		const token = await authenticate(validated.email, validated.passphrase);

		return {
			headers,
			body: JSON.stringify({
				token
			}),
			statusCode: 200
		};
	} catch (err) {
		console.error(err);
	}
}

exports.handler = arc.http.async(route);
