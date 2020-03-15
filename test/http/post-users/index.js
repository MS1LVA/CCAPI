'use strict';

const chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	expect = chai.expect,
	describe = require('mocha').describe,
	request = require('superagent'),
	faker = require('faker');

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

describe('http/post-users', () => {
	describe('succeed', () => {
		let fakeCredentials = {
			email: faker.internet.email(),
			passphrase: faker.internet.password()
		};
		it('should successfully create a user', async () => {
			const result = await request
				.post(`${global.BASE}/users`)
				.send(fakeCredentials);
			expect(result).to.be.an('object');
			expect(result.ok).to.be.a('boolean').equals(true);
			expect(result.statusCode).to.be.a('number').equals(200);
			expect(result.body).to.be.an('object');
			expect(result.body).to.have.property('success').a('boolean').equals(true);
		});
	});
	describe('fail', () => {
		it('should fail to create a user with a short passphrase', async () => {
			const promise = postUser(faker.internet.email(), 'short');
			expect(promise).to.be.rejectedWith(/unprocessable entity/i);
		});
		it('should fail to create a user with an invalid email', async () => {
			const promise = postUser('invalidemail', faker.internet.password());
			expect(promise).to.be.rejectedWith(/unprocessable entity/i);
		});
	});
});
