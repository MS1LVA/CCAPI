'use strict';

const get = require('lodash.get'),
	event = require('../../../lib/event');

exports.handler = async function subscribe (evt) {
	const records = evt.Records;
	if (!records || !records.length) return false;

	const returner = [];

	// This could be a set of records
	for (const record of records) {
		const message = get(record, 'Sns.Message');

		// We can't create a meaningful entry without a message.
		if (!message) continue;

		const parsedMessage = JSON.parse(message),
			payload = {
				...parsedMessage,
				targetIdentifer: parsedMessage.email,
				message
			};

		// Fire off an event
		returner.push(await event.publish(payload, event.type.create, event.target.user));
	}

	return returner;
};
