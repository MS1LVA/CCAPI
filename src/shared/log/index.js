'use strict';

/**
 * @file Handles writing of various messages to the logs table.
 * @module shared/log
 */

const arc = require('@architect/functions'),
	{ v4: uuid } = require('uuid'),
	partial = require('lodash.partial'),
	// Consts
	LOGS = {
		type: {
			default: 'DEF',
			error: 'ERR',
			info: 'INF'
		}
	};

async function log(type, message, optionalPayload) {
	return arc.queues.publish({
		name: 'log',
		payload: {
			identifier: uuid(),
			message,
			type,
			payload: optionalPayload ? JSON.stringify(optionalPayload) : null
		}
	});
}

module.exports = partial(log, LOGS.type.default);
module.exports.error = partial(log, LOGS.type.error);
module.exports.info = partial(log, LOGS.type.info);
