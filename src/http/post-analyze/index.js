'use strict';

const configEnv = process.env.NODE_ENV || 'local',
	config = require('@architect/shared/config')(configEnv),
	{ clamp } = require('@architect/shared/utility/number'),
	analyze = require('@architect/shared/naturalLanguage')(config, clamp),
	headers = config.get('api.response.headers.default', {}),
	{ sleep, encryptToken } = require('@architect/shared/utility')(config),
	arc = require('@architect/functions'),
	Redis = require('@architect/shared/redis')(config),
	session = require('@architect/shared/session')(encryptToken, Redis, config),
	event = require('@architect/shared/event'),
	log = require('@architect/shared/log'),
	{ route: authRoute } = require('@architect/shared/user')(session, sleep, event, log),
	validateInput = require('@architect/shared/validate');

async function route(request) {
	try {
		const { validated, errors } = validateInput(request.body, {
				text: {
					type: 'string',
					presence: true
				}
			}),
			newToken = await authRoute(request);

		// Short-circuit on bad input
		if (errors.length) return {
			statusCode: 422,
			body: JSON.stringify({
				errors
			})
		};

		const analyzedData = {
			entities: await analyze.analyzeEntities(validated.text),
			entitySentiment: await analyze.analyzeEntitySentiment(validated.text),
			syntax: await analyze.analyzeSyntax(validated.text),
			sentiment: await analyze.analyzeSentiment(validated.text)
		};

		return {
			headers,
			body: JSON.stringify({
				token: newToken,
				success: true,
				data: analyzedData
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
