'use strict';

const expect = require('chai').expect,
	describe = require('mocha').describe,
	request = require('superagent'),
	// Consts
	BASE = 'http://localhost:3333';

describe('http/get-index', () => {
	it('should return the names of all DynamoDB tables', async () => {
		const result = await request.get(BASE);
		expect(result).to.be.an('object');
		expect(result).to.have.property('statusCode').equals(200);
		expect(result.body).to.be.an('array');
	});
});
