'use strict';

const arc = require('@architect/functions'),
	{ route: authRoute } = require('../../../lib/user'),
	validateInput = require('../../../lib/validate'),
	analyze = require('../../../lib/naturalLanguage'),
	route = async (request) => {
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
				body: JSON.stringify({
					token: newToken,
					success: true,
					data: analyzedData
				}),
				statusCode: 200
			};
		} catch (err) {
			console.log(err);
		}
	};

exports.handler = arc.http.async(route);
