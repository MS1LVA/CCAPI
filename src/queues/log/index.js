'use strict';

const arc = require('@architect/functions');

exports.handler = async function queue (event) {
	const records = event.Records;
	if (!records || !records.length) return;

	const { logs } = await arc.tables(),
		returner = [];

	for (const record of records) {
		const parsed = JSON.parse(record.body);
		try {
			await logs.put(parsed);
			returner.push(true);
		} catch (err) {
			returner.push(false);
		}
	}

	return returner;
};
