'use strict';

exports.handler = async (req) => {
	if (req.httpMethod == 'OPTIONS') {
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, PUT, PATCH, POST, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*'
			},
			body: JSON.stringify({ multitude: true })
		};
	}

	return {
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			time: new Date().toISOString()
		}, null, 2),
		statusCode: 200
	};
};
