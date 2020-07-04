'use strict';

const arc = require('@architect/functions'),
	{ v4: uuid } = require('uuid'),
	EVENT = {
		type: {
			default: 'none',
			create: 'CREATE',
			read: 'READ',
			update: 'UPDATE',
			delete: 'DELETE'
		},
		target: {
			default: 'SYSTEM',
			system: 'SYSTEM',
			user: 'USER',
			history: 'HISTORY',
			session: 'SESSION'
		}
	};

async function publish(event, type, target) {
	try {
		if (!type || !EVENT.type[type]) type = EVENT.type.default;
		if (!target || !EVENT.target[target]) target = EVENT.target.default;

		const { events } = await arc.tables(),
			payload = {
				created: new Date().toISOString(),
				identifier: event.identifier || uuid(),
				type,
				target,
				...event // Hopefully overwrites the defaults we just made
			};

		// Create entry in the events table
		await events.put({
			...payload
		});
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = {
	publish,
	type: EVENT.type,
	target: EVENT.target
};
