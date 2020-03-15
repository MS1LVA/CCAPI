'use strict';

/**
 * @file Deep-merges configs into one big config object.
 * @module lib/config
 */

const deepmerge = require('deepmerge'),
	configs = {
		production: require('../../config/default.json'),
		local: require('../../config/local.json'),
		testing: require('../../config/test.json')
	},
	get = require('lodash.get'),
	key = process.env.NODE_ENV || 'local',
	merged = key !== 'production' && Object.keys(configs).includes(key) ? deepmerge(configs.production, configs[key]) : configs.production,
	settings = merged;

Object.freeze(settings);

module.exports = {
	get: (key, defaultValue = null) => get(settings, key, defaultValue)
};
