'use strict';

/**
 * @file Deep-merges configs into one big config object.
 * @module lib/config
 */

const deepmerge = require('deepmerge'),
	configs = {
		PROD: require('../../config/default.json'),
		LOCAL: require('../../config/local.json'),
		TEST: require('../../config/test.json')
	},
	get = require('lodash.get'),
	key = process.env.NODE_ENV || 'LOCAL',
	merged = key !== 'PROD' ? deepmerge(configs.PROD, configs[key]) : configs.PROD,
	settings = merged;

Object.freeze(settings);

module.exports = {
	get: (key, defaultValue = null) => get(settings, key, defaultValue)
};
