'use strict';

const describe = require('mocha').describe,
	expect = require('chai').expect,
	arc = require('@architect/functions'),
	faker = require('faker'),
	log = require('../../../lib/log');

describe('src/queues/log', () => {
	/**
	 * I haven't found a great way to test this besides this polling method.
	 * We're calling a lib function, which fires off to the log queue,
	 * and the log queue writes to the logs table. The queue can't be awaited
	 * so we have to poll the table until we time out or we find the message.
	 */
	it('should create a log', async () => {
		const message = faker.random.words(10);
		log(message);
		const { logs } = await arc.tables();
		let results;
		// Don't worry about this going on forever, timeout will cancel it.
		while (!results) {
			const scan = await logs.scan({
				ExpressionAttributeValues: {
					':m': message
				},
				FilterExpression: 'message = :m'
			});
			if (scan.Count) results = scan;
		}
		expect(results).to.be.an('object').have.property('Items').an('array').lengthOf(1);
		expect(results.Items[0].message).to.equal(message);
	}).timeout(5000);
});
