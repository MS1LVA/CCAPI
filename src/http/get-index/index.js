const arc = require('@architect/functions');

exports.handler = async function http (req) {
	const tables = await arc.tables();
	return {
		body: JSON.stringify(Object.keys(tables), null, 2),
		statusCode: 200
	};
}