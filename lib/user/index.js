'use strict';

const { v4: uuid } = require('uuid'),
	bcrypt = require('bcrypt'),
	session = require('./session'),
	{ sleep } = require('../utility'),
	arc = require('@architect/functions');

async function create(email, passphrase) {
	// Random sleep to prevent email enumeration.
	await sleep();

	const { users } = await arc.tables();
	if (!email || !passphrase) return false;

	const transformedEmail = `${email}`.toLowerCase(),
		params = {
			KeyConditionExpression: 'email = :email',
			ExpressionAttributeValues: {
				':email': transformedEmail
			}
		},
		// Try to find an existing user with this email.
		search = await users.query(params);
	if (search.Count > 0) return false;

	// Encrypt passphrase
	const salt = await bcrypt.genSalt(),
		hash = await bcrypt.hash(passphrase, salt),
		userId = uuid();

	// Create row
	await users.put({
		userId,
		email: transformedEmail,
		passphrase: hash
	});

	// Fire off an event
	await arc.events.publish({
		name: 'user-signup',
		payload: {
			email: transformedEmail,
			userId
		}
	});

	return true;
}

async function authenticate(email = null, passphrase = null) {
	// Random sleep to prevent consistently timing this function.
	await sleep();

	if (!email || !passphrase) return false;

	const transformedEmail = `${email}`.toLowerCase(),
		{ users } = await arc.tables(),
		params = {
			KeyConditionExpression: 'email = :email',
			ExpressionAttributeValues: {
				':email': transformedEmail
			}
		},
		userQuery = await users.query(params);
	if (!userQuery.Items.length) return false;

	const user = userQuery.Items[0],
		matchPass = await bcrypt.compare(passphrase, user.passphrase);
	if (!matchPass) return false;

	const sessionHash = await session.set(user.userId);
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
