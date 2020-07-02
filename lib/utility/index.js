'use strict';

const crypto = require('crypto'),
	config = require('../config'),
	secret = config.get('user.token.secret');

function encryptToken(token) {
	return crypto.createHmac('sha256', secret)
		.update(token)
		.digest('hex');
}

/**
 * @description Sleep for a specified or random amount of milliseconds.
 */
function sleep(time) {
	const rdMax = config.get('user.randomSleep');
	return new Promise(res => {
		const rdSleep = (Math.random() * 10 * rdMax).toFixed();
		setTimeout(res, (time || rdSleep));
	});
}

module.exports = {
	encryptToken,
	sleep
};
