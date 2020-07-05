'use strict';

const expect = require('chai').expect,
	describe = require('mocha').describe,
	arc = require('@architect/functions'),
	{ v4: uuid } = require('uuid'),
	faker = require('faker');

describe('events/user-signup', () => {
	it('should add an event to the events table', async () => {
		const { events } = await arc.tables(),
			identifier = uuid();
		await arc.events.publish({
			name: 'user-signup',
			payload: {
				identifier,
				email: faker.internet.email(),
				userId: uuid()
			}
		});
		let results;
		while (!results) {
			const params = {
					KeyConditionExpression: 'identifier = :identifier',
					ExpressionAttributeValues: {
						':identifier': identifier
					}
				},
				search = await events.query(params);
			if (search.Count) results = search;
		}
		expect(results).to.be.an('object').have.property('Items').an('array').lengthOf(1);
		expect(results.Items[0]).to.be.an('object').have.property('identifier').equals(identifier);
	}).timeout(10000);
});
