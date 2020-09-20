'use strict';

/**
 * @file Handles any calls to redis, our ephemeral data store.
 * @module shared/redis
 */

const redis = require('redis');

module.exports = (config) => {
	const redisConfig = config.get('redis'),
		client = redis.createClient({
			...redisConfig
		});

	async function has(key) {
		return exists(key);
	}

	async function exists(key) {
		const result = await get(key);
		return !!result;
	}

	async function set(key, value, expires = 60) {
		return client.set(key, value, 'EX', expires);
	}

	async function get(key) {
		return new Promise((resolve, reject) => {
			client.get(key, (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	}

	async function ttl(key) {
		return new Promise((resolve) => {
			client.ttl(key, (seconds) => {
				resolve(seconds);
			});
		});
	}

	async function del(key) {
		return client.del(key);
	}

	return {
		has,
		exists,
		set,
		get,
		ttl,
		del
	};
};

