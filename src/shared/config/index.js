'use strict';

/**
 * @file Deep-merges configs into one big config object.
 * @module shared/config
 */

const deepmerge = require('deepmerge'),
	get = require('lodash.get');

module.exports = (key) => {
	const configs = {
			production: require('./configuration/default.json'),
			local: require('./configuration/local.json'),
			testing: require('./configuration/test.json')
		},
		merged = key !== 'production' && Object.keys(configs).includes(key) ? deepmerge(configs.production, configs[key]) : configs.production;

	Object.freeze(merged);

	return {
		get: (key, defaultValue = null) => get(merged, key, defaultValue)
	};
};
