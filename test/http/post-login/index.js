'use strict';

const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	expect = chai.expect,
	describe = require('mocha').describe,
	request = require('superagent'),
	faker = require('faker'),
	configEnv = process.env.NODE_ENV || 'local',
	config = require('../../../src/shared/config')(configEnv),
	{ sleep, encryptToken } = require('../../../src/shared/utility')(config),
	Redis = require('../../../src/shared/redis')(config),
	session = require('../../../src/shared/session')(encryptToken, Redis, config),
	user = require('../../../src/shared/user')(session, sleep);

chai.use(chaiAsPromised);

function postUser(email, pass) {
	return new Promise((res, rej) => {
		request
			.post(`${global.BASE}/users`)
			.send({
				email,
				pass
			})
			.then(data => res(data))
			.catch(err => rej(err));
	});
}

describe('http/post-login', () => {
	let fakeCredentials = {
		email: faker.internet.email(),
		passphrase: faker.internet.password()
	};
	describe('succeed', () => {
		before(async () => {
			await user.create(fakeCredentials.email, fakeCredentials.passphrase);
		});
		it('should successfully authenticate a user with valid credentials', async () => {
			const result = await request
				.post(`${global.BASE}/login`)
				.send(fakeCredentials);
			expect(result).to.be.an('object').have.property('statusCode').a('number').equals(200);
			expect(result).to.have.property('body').an('object').have.property('token').a('string').lengthOf(64);
		});
	});
	describe('fail', () => {
		it('should fail to authenticate a user with invalid credentials', async () => {
			const promise = postUser(fakeCredentials.email, faker.internet.password());
			expect(promise).to.be.rejected;
		});
	});
});
