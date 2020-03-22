'use strict';

const user = require('../index.js'),
	describe = require('mocha').describe,
	it = require('mocha').it,
	faker = require('faker'),
	fakeCreds = {
		email: faker.internet.email(),
		password: faker.internet.password()
	};

require('chai').should();

describe('lib/user', () => {
	describe(':create', () => {
		it('should successfully create a user', async () => {
			const created = await user.create(fakeCreds.email, fakeCreds.password);
			created.should.be.a('boolean').equal(true);
		});
	});
});
