'use strict';

/**
 * @file Handles management of sessions.
 * @module shared/session
 */

const { v4: uuid } = require('uuid');

module.exports = (encryptToken, Redis, config) => {
	const DURATION = config.get('user.session.duration', 600);

	async function get(hash) {
		const key = `session-${hash}`,
			exists = await Redis.has(key);
		if (!exists) return null;
		return Redis.get(key);
	}

	async function set(userId) {
		const identifier = uuid(),
			hash = encryptToken(identifier),
			key = `session-${hash}`,
			exists = await Redis.has(hash);
		if (exists) return renew(hash);
		await Redis.set(key, userId, DURATION);
		return hash;
	}

	async function stop(hash) {
		const key = `session-${hash}`;
		await Redis.del(key);
	}

	async function renew(hash) {
		const key = `session-${hash}`,
			exists = await Redis.has(key);
		if (!exists) return null;
		const userId = await get(hash),
			newHash = await set(userId);
		return newHash;
	}

	return {
		get,
		set,
		stop,
		renew
	};
};
