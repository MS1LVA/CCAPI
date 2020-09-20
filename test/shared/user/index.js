'use strict';

const configEnv = process.env.NODE_ENV || 'local',
	config = require('../../../src/shared/config')(configEnv),
	{ sleep, encryptToken } = require('../../../src/shared/utility')(config),
	Redis = require('../../../src/shared/redis')(config),
	session = require('../../../src/shared/session')(encryptToken, Redis, config),
	user = require('../../../src/shared/user')(session, sleep),
	describe = require('mocha').describe,
	it = require('mocha').it,
	faker = require('faker'),
	fakeCreds = {
		email: faker.internet.email(),
		password: faker.internet.password()
	};

require('chai').should();

describe('shared/user', () => {
	describe(':create', () => {
		it('should successfully create a user', async () => {
			const created = await user.create(fakeCreds.email, fakeCreds.password);
			created.should.be.a('boolean').equal(true);
		});
	});
});
