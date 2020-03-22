'use strict';

/**
 * @file A class for controlling Users and Sessions.
 * @module lib/user
 */

const { v4: uuid } = require('uuid'),
	bcrypt = require('bcrypt'),
	session = require('./session'),
	{ sleep } = require('../utility'),
	arc = require('@architect/functions');

async function create(email = null, passphrase = null) {
	// Random sleep to prevent email enumeration.
	await sleep();

	console.log('CREATING', email, passphrase);

	const { users } = await arc.tables();
	if (!email || !passphrase) return false;


	const transformedEmail = `${email}`.toLowerCase(),
	 params = {
			FilterExpression: 'email = :email',
			ExpressionAttributeValues: {
				':email': transformedEmail
			}
		},

		// Try to find an existing user with this email.
	 search = await users.scan(params);
	if (search.Count > 1) return false;

	// Encrypt passphrase
	const salt = await bcrypt.genSalt(),
		hash = await bcrypt.hash(passphrase, salt);

	// Create row
	await users.put({
		userID: uuid(),
		email: transformedEmail,
		passphrase: hash
	});

	// Only return success
	return true;
}

async function authenticate(email = null, passphrase = null) {
	// Random sleep to prevent consistently timing this function.
	await sleep();

	console.log('AUTHENTICATING', email, passphrase);

	if (!email || !passphrase) return false;

	const transformedEmail = `${email}`.toLowerCase(),
		{ users } = await arc.tables(),
		userScan = await users.scan({
			email: transformedEmail
		});
	console.log('USERS', userScan);
	if (!userScan.Items.length) return false;

	const user = userScan.Items[0],
		matchPass = await bcrypt.compare(passphrase, user.passphrase);
	if (!matchPass) return false;

	console.log('MATCHPASS');

	const sessionHash = await session.set(user.userID);
	console.log('SESSION HASH', sessionHash);
	return sessionHash;
}

async function checkToken(hash) {
	return session.renew(hash);
}

async function route(request) {
	const token = (request.headers.Authorization || 'Bearer x').toLowerCase().split('bearer ')[1],
		renewed = await checkToken(token);
	if (!token || !renewed) return false;
	// xx - Validate permission, isPaid etc.
	return renewed;
}

module.exports = {
	create,
	authenticate,
	route
};
