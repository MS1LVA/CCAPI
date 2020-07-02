'use strict';

const arc = require('@architect/functions'),
	{ v4: uuid } = require('uuid'),
	get = require('lodash.get'),
	EVENT = {
		type: {
			default: 'none',
			valid: ['create', 'read', 'update', 'delete']
		},
		target: {
			default: 'system',
			valid: ['user', 'history', 'session']
		}
	};

function getAttribute(space = 'type', parsedMessage = {}) {
	if (!Object.keys(EVENT).includes(space)) return EVENT.type.default;
	if (!parsedMessage || !parsedMessage[space] || !EVENT[space].valid.includes(parsedMessage[space])) return EVENT[space].default;
	return parsedMessage[space];
}

exports.handler = async function subscribe (event) {
	const records = event.Records;
	if (!records || !records.length) return;

	const { events } = await arc.tables();

	for (const record of records) {
		const message = get(record, 'Sns.Message');

		// We can't create a meaningful entry without a message.
		if (!message) continue;

		// Add a timestamp, construct the payload.
		const parsedMessage = JSON.parse(message),
			identifier = parsedMessage.identifier || uuid(),
			payload = {
				created: new Date().toISOString(),
				identifier,
				type: getAttribute('type', parsedMessage),
				target: getAttribute('target', parsedMessage),
				message
			};

		// Create entry in the events table
		await events.put({
			...payload
		});
	}
};
