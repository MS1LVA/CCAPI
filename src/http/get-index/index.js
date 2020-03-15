'use strict';

exports.handler = async () => {
	return {
		body: JSON.stringify({
			time: new Date().toISOString()
		}, null, 2),
		statusCode: 200
	};
};
