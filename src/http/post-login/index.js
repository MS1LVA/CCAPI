'use strict';

const user = require('../../../lib/user'),
	arc = require('@architect/functions'),
	validateInput = require('../../../lib/validate'),
	route = async (request) => {
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
		if (errors.length) return {
			statusCode: 422,
			body: JSON.stringify({
				errors
			})
		};

		const token = await user.authenticate(validated.email, validated.passphrase);

		return {
			body: JSON.stringify({
				token
			}),
			statusCode: 200
		};
	};

exports.handler = arc.http.async(route);
