'use strict';

const expect = require('chai').expect,
	describe = require('mocha').describe,
	request = require('superagent');

describe('http/get-index', () => {
	it('should return the current time', async () => {
		const result = await request.get(global.BASE);
		expect(result).to.be.an('object');
		expect(result).to.have.property('statusCode').equals(200);
		expect(result.body)
			.to.be.an('object')
			.have.property('time')
			.a('string');
	});
});
