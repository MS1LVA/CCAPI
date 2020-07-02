'use strict';

const expect = require('chai').expect,
	describe = require('mocha').describe,
	arc = require('@architect/functions'),
	{ v4: uuid } = require('uuid'),
	{ sleep } = require('../../../lib/utility'),
	faker = require('faker');

let events;

async function testEvent(identifier) {
	await sleep(1500);
	const params = {
			KeyConditionExpression: 'identifier = :identifier',
			ExpressionAttributeValues: {
				':identifier': identifier
			}
		},
		search = await events.query(params);
	expect(search).to.be.an('object').have.property('Items').an('array').lengthOf(1);
	expect(search.Items[0]).to.be.an('object').have.property('identifier').equals(identifier);
}

describe('events/user-signup', () => {
	it('should add an event to the events table', async () => {
		events = (await arc.tables()).events;
		const identifier = uuid();
		await new Promise((resolve, reject) => {
			arc.events.publish({
				name: 'user-signup',
				payload: {
					email: faker.internet.email(),
					identifier
				}
			},
			() => {
				testEvent(identifier)
					.then(resolve)
					.catch(reject);
			});
		});
	}).timeout(45000);
});
