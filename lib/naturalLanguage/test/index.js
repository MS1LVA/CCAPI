'use strict';

const naturalLanguage = require('..'),
	describe = require('mocha').describe,
	it = require('mocha').it,
	{ clamp } = require('../../utility/number'),
	faker = require('faker');

require('chai').should();

describe('lib/naturalLanguage', () => {
	describe(':analyzeEntities', () => {
		it('should analyze the entities of a block of text', async () => {
			const text = faker.random.words(clamp(faker.random.number(64), 16, 64)),
				result = await naturalLanguage.analyzeEntities(text);
			result.should.be.an('array');
			result[0].should.be.an('object').have.property('mentions').an('array');
			result[0].mentions[0].should.have.property('text').an('object').have.property('content').a('string');
		});
	});
	describe(':analyzeEntitySentiment', () => {
		it('should analyze entity sentiment of a block of text', async () => {
			const text = faker.random.words(clamp(faker.random.number(64), 16, 64)),
				result = await naturalLanguage.analyzeEntitySentiment(text);
			result.should.be.an('array');
			result[0].should.be.an('object').have.property('salience').a('number').lessThan(1.1).greaterThan(0);
			result[0].should.have.property('sentiment').an('object').have.property('magnitude').a('number').greaterThan(0);
			result[0].sentiment.should.have.property('score').a('number');
		});
	});
	describe(':analyzeSyntax', () => {
		it('should analyze syntax of a block of text', async () => {
			const text = faker.random.words(clamp(faker.random.number(64), 16, 64)),
				result = await naturalLanguage.analyzeSyntax(text);
			result.should.be.an('array');
			result[0].should.have.property('partOfSpeech').an('object');
			result[0].partOfSpeech.should.have.property('tag').a('string');
			result[0].partOfSpeech.should.have.property('aspect').a('string');
			result[0].partOfSpeech.should.have.property('case').a('string');
			result[0].partOfSpeech.should.have.property('form').a('string');
			result[0].partOfSpeech.should.have.property('gender').a('string');
			result[0].partOfSpeech.should.have.property('mood').a('string');
			result[0].partOfSpeech.should.have.property('number').a('string');
			result[0].partOfSpeech.should.have.property('person').a('string');
			result[0].partOfSpeech.should.have.property('proper').a('string');
			result[0].partOfSpeech.should.have.property('reciprocity').a('string');
			result[0].partOfSpeech.should.have.property('tense').a('string');
			result[0].partOfSpeech.should.have.property('voice').a('string');
			result[0].should.have.property('dependencyEdge').an('object').have.property('headTokenIndex').a('number');
			result[0].should.have.property('dependencyEdge').an('object').have.property('label').a('string');
		});
	});
	describe(':analyzeSentiment', () => {
		it('should analyze sentiment of a block of text', async () => {
			const text = faker.random.words(clamp(faker.random.number(64), 16, 64)),
				result = await naturalLanguage.analyzeSentiment(text);
			result.should.be.an('array');
			result[0].should.be.an('object').have.property('text').an('object').have.property('content').equals(text);
			result[0].should.have.property('sentiment').an('object').have.property('magnitude').a('number');
			result[0].should.have.property('sentiment').an('object').have.property('score').a('number');
		});
	});
	describe(':classifyText', () => {
		it('should classify a block of text', async () => {
			const text = faker.random.words(clamp(faker.random.number(64), 16, 64)),
				result = await naturalLanguage.classifyText(text);
			result.should.be.an('array');
			result[0].should.be.an('object').have.property('name').a('string');
			result[0].should.have.property('confidence').a('number').greaterThan(0).lessThan(1.1);
		});
	});
});
