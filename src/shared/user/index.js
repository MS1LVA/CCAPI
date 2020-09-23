'use strict';

/**
 * @file Manages users & their data, makes calls to sessions.
 * @module shared/user
 */

const { v4: uuid } = require('uuid'),
	bcrypt = require('bcrypt'),
	arc = require('@architect/functions');

module.exports = (session, sleep, event, log) => {
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

		log.info(`User created - ${transformedEmail} - ${userId}`);

		// Fire off an event
		event.publish({
			email: transformedEmail,
			userId
		}, event.type.create, event.target.user);

		return true;
	}

	async function getById(id) {
		if (!id) return false;
		const { users } = await arc.tables(),
			params = {
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': id
				}
			},
			userQuery = await users.query(params);
		if (!userQuery.Items.length) return false;

		const user = userQuery.Items[0];
		return user;
	}

	async function getByEmail(email) {
		if (!email) return false;
		const transformedEmail = email.toLowerCase(),
			{ users } = await arc.tables(),
			params = {
				KeyConditionExpression: 'email = :email',
				ExpressionAttributeValues: {
					':email': transformedEmail
				}
			},
			userQuery = await users.query(params);
		if (!userQuery.Items.length) return false;

		const user = userQuery.Items[0];
		return user;
	}

	async function authenticate(email, passphrase) {
		// Random sleep to prevent consistently timing this function.
		await sleep();

		if (!email || !passphrase) return false;

		const user = await getByEmail(email),
			matchPass = await bcrypt.compare(passphrase, user.passphrase);
		if (!matchPass) return false;

		const sessionHash = await session.set(user.userId);

		log.info(`User authenticated - ${email.toLowerCase()}`);
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

	route.admin = async function(request) {
		const token = (request.headers.Authorization || 'Bearer x').toLowerCase().split('bearer ')[1],
			userId = await session.get(token),
			user = await getById(userId),
			isAdmin = user.admin === 1;
		if (!isAdmin) return;

		const newToken = await route(request);
		if (!newToken) return;
		return newToken;
	};

	return {
		create,
		authenticate,
		route
	};
};
