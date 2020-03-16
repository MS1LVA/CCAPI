'use strict';

const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	expect = chai.expect,
	describe = require('mocha').describe,
	request = require('superagent'),
	faker = require('faker'),
	user = require('../../../lib/user');

chai.use(chaiAsPromised);

describe('http/post-analyze', () => {
	describe('succeed', () => {
		let fakeCredentials = {
				email: faker.internet.email(),
				passphrase: faker.internet.password()
			},
			userToken;
		before(async () => {
			await user.create(fakeCredentials.email, fakeCredentials.passphrase);
			userToken = await user.authenticate(fakeCredentials.email, fakeCredentials.passphrase);
		});
		it('should successfully analyze text from an authenticated user', async () => {
			const result = await request
				.post(`${global.BASE}/analyze`)
				.set('Authorization', `Bearer ${userToken}`)
				.send({
					text: faker.random.words(12)
				});
			expect(result).to.be.an('object').have.property('statusCode').a('number').equals(200);
			expect(result).to.have.property('body').an('object').have.property('token').a('string').lengthOf(64);
		}).timeout(10000);
	});
});
