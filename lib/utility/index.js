'use strict';

const crypto = require('crypto'),
	config = require('../config/.js'),
	secret = config.get('user.token.secret');

function encryptToken(token) {
	return crypto.createHmac('sha256', secret)
		.update(token)
		.digest('hex');
}

module.exports = {
	encryptToken
};
