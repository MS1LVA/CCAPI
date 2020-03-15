'use strict';

/**
 * @file A class for controlling Users and Sessions.
 * @module lib/user
 */

const { v4: uuid } = require('uuid'),
	bcrypt = require('bcrypt'),
	// session = require('./session'),
	arc = require('@architect/functions');

async function create(email = null, password = null) {
	const { users } = await arc.tables();
	if (!email || !password) return false;

	// Try to find an existing user with this email.
	const search = await users.scan({
		email
	});
	if (search.Count > 0) return false;

	// Encrypt password
	const salt = await bcrypt.genSalt(),
		hash = await bcrypt.hash(password, salt);

	// Create row
	await users.put({
		userID: uuid(),
		email,
		passphrase: hash
	});

	// Only return success
	return true;
}

/* async function authenticate(email = null, password = null) {
	const { users } = await arc.tables();
	// Random sleep to prevent consistently timing this function.
	await new Promise(res => {
		const rdSleep = (Math.random() * 10 * 250).toFixed();
		setTimeout(() => {
			res();
		}, rdSleep);
	});
	if (!email || !password) return false;
	const user = await users.get({
		email
	});
	if (!user) return false;
	const matchPass = await bcrypt.compare(password, user.password);
	if (!matchPass) return false;
	const sessionHash = await session.set({
		userId: user._id.toString()
	});
	return sessionHash;
} */

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
	/* authenticate,
	update,
	getById,
	existsById,
	existsByEmail,
	route */
};
