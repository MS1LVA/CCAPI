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

	const { users } = await arc.tables();
	if (!email || !passphrase) return false;

	const transformedEmail = `${email}`.toLowerCase(),

		// Try to find an existing user with this email.
		search = await users.scan({
			email: transformedEmail
		});
	if (search.Count > 0) return false;

	// Encrypt passphrase
	const salt = await bcrypt.genSalt(),
		hash = await bcrypt.hash(passphrase, salt);

	// Create row
	await users.put({
		userID: uuid(),
		transformedEmail,
		passphrase: hash
	});

	// Only return success
	return true;
}

async function authenticate(email = null, passphrase = null) {
	// Random sleep to prevent consistently timing this function.
	await sleep();

	if (!email || !passphrase) return false;

	const transformedEmail = `${email}`.toLowerCase(),
		{ users } = await arc.tables(),
		userScan = await users.scan({
			email: transformedEmail
		});
	if (!userScan.Items.length) return false;

	const user = userScan.Items[0],
		matchPass = await bcrypt.compare(passphrase, user.passphrase);
	if (!matchPass) return false;

	const sessionHash = await session.set(user.userID);
	return sessionHash;
}

/* async function update(id, payload) {
	const { users } = await arc.tables(),
		existing = await getById(id);
	if (!existing) return null;
	return users.update({
		Key: {
			userID: id
		},

	});
} */

/* async function getById(id) {
	const existing = await UserModel.findOne({
		id
	});
	if (!(existing instanceof Object) || !Object.keys(existing).length) return null;
	return existing;
} */

/* async function existsById(id) {
	return UserModel.exists({
		id
	});
}

async function existsByEmail(email) {
	return UserModel.exists({
		email
	});
}

async function checkToken(hash) {
	return session.renew({
		hash
	});
} */

/* function route(req) {
	const token = (req.get('Authorization') || 'Bearer x').toLowerCase().split('bearer ')[1],
		renewed = checkToken(token);
	if (!token || !renewed) return false;
	// xx - Validate permission, isPaid etc.
	return renewed;
} */

module.exports = {
	create,
	authenticate,
	/* update,
	getById,
	existsById,
	existsByEmail,
	route */
};
