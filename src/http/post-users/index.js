'use strict';

const configEnv = process.env.NODE_ENV || 'local',
	omitDeep = require('omit-deep'),
	config = require('@architect/shared/config')(configEnv),
	headers = config.get('api.response.headers.default', {}),
	{ sleep, encryptToken } = require('@architect/shared/utility')(config),
	arc = require('@architect/functions'),
	log = require('@architect/shared/log'),
	event = require('@architect/shared/event'),
	Redis = require('@architect/shared/redis')(config),
	session = require('@architect/shared/session')(encryptToken, Redis, config),
	user = require('@architect/shared/user')(session, sleep, event, log),
	validateInput = require('@architect/shared/validate');

function screen(subject) {
	return omitDeep(subject, 'passphrase');
}

async function route(request) {
	try {
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
		if (errors.length) {
			log.error('User failed sign-in', {
				errors,
				request: screen(request)
			});
			return {
				body: JSON.stringify({
					errors
				}),
				statusCode: 422
			};
		}

		await user.create(validated.email, validated.passphrase);
		log.info(`User successfully created for ${validated.email}`);

		return {
			headers,
			body: JSON.stringify({
				success: true
			}),
			statusCode: 200
		};
	} catch (err) {
		log.error(err);
		return {
			headers,
			body: JSON.stringify({
				success: false
			}),
			statusCode: 500
		};
	}
}

exports.handler = arc.http.async(route);
